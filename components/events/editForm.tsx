"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { startOfToday, endOfToday } from "date-fns";
import { CalendarIcon, ImageIcon, MapIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebaseConfig";
import { Separator } from "../ui/separator";

const editSchema = z
  .object({
    title: z.string({ required_error: "Title is required" }),
    location: z.string({ required_error: "Destination must be specified" }),
    description: z.string({ required_error: "Description is required" }),
    startDate: z.date({ required_error: "Start date required" }),
    endDate: z.date({ required_error: "End date required" }),
    imageUrl: z.string().optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date cannot be before the start date",
    path: ["endDate"],
  });

type FormValues = z.infer<typeof editSchema>;

export default function EditForm({ eventId }: { eventId: string }) {
  const router = useRouter();
  const { user } = useAuth(); // Get the authenticated user
  const [loading, setLoading] = useState(true);
  const [communityName, setCommunityName] = useState<string | null>(null); // State to store the community name
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      startDate: startOfToday(),
      endDate: endOfToday(),
      imageUrl: "",
    },
  });

  // Fetch event data
  useEffect(() => {
    async function fetchEventData() {
      if (!eventId) return;

      const eventDocRef = doc(db, "events", eventId);
      const eventSnapshot = await getDoc(eventDocRef);

      if (eventSnapshot.exists()) {
        const eventData = eventSnapshot.data();
        form.reset({
          title: eventData.title,
          location: eventData.location,
          description: eventData.description,
          startDate: eventData.startDate.toDate(),
          endDate: eventData.endDate.toDate(),
          imageUrl: eventData.imageUrl,
        });
      } else {
        toast({
          title: "Event Not Found",
          description: `Event with ID "${eventId}" does not exist.`,
        });
        router.push("/dashboard");
      }
      setLoading(false);
    }
    if (user) {
      const fetchCommunityName = async () => {
        try {
          const userDocRef = doc(db, "users", user.uid); // Assuming the 'users' collection holds user info
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setCommunityName(userData?.community_name || ""); // Set community name in state
          } else {
            console.error("No user document found!");
          }
        } catch (error) {
          console.error("Error fetching community name:", error);
        }
      };

      fetchCommunityName();
    }

    fetchEventData();
  }, [eventId, form, router, toast, user]);

  async function onSubmit(values: FormValues) {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to edit an event.",
      });
      return;
    }

    try {
      const updatedEvent = {
        ...values,
        community_name: communityName, // Include the community_name from state
        user_id: user.uid, // Set the user_Id to the current user's ID from context
        createdAt: new Date().toISOString(),
      };

      const eventDocRef = doc(db, "events", eventId);
      await setDoc(eventDocRef, updatedEvent, { merge: true });

      toast({
        title: "Event Updated!",
        description: `Event "${updatedEvent.title}" has been updated.`,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Event update failed", error);
      toast({
        title: "Event Update Failed!",
        description: `There was an error updating the event.`,
      });
    }
  }

  if (loading) {
    return <p>Loading event data...</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Form fields are the same as CreateForm but pre-filled with the event data */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Event title"
                  className="w-full p-2 bg-transparent text-white rounded-md placeholder-gray-400 border-transparent hover:border-white focus:border-white transition duration-300"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Separator />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Tell us about the event"
                  className="w-full p-2 bg-transparent text-white rounded-md placeholder-gray-400 border-transparent hover:border-white focus:border-white transition duration-300"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="grid grid-rows-2 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full p-2 text-left bg-transparent text-white rounded-md placeholder-gray-400 border-2 border-yellow-500",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "MM/dd/yyyy")
                          ) : (
                            <span>Pick a start date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full p-2 text-left bg-transparent text-white rounded-md placeholder-gray-400 border-2 border-yellow-500",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "MM/dd/yyyy")
                          ) : (
                            <span>Pick an end date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <MapIcon className="text-yellow-500 mr-2" />
                    <Input
                      placeholder="Event location"
                      className="w-full p-2 text-left bg-transparent text-white rounded-md placeholder-gray-400 border-2 border-yellow-500"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <Separator />
        <div className="flex justify-center mt-8">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"default"}
                className="text-yellow-500 bg-transparent hover:bg-transparent hover:text-white hover:underline"
              >
                <ImageIcon className="size-8" /> Upload an Image
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Image URL (optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Image URL"
                        className="w-full p-2 bg-transparent text-white rounded-md placeholder-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </PopoverContent>
          </Popover>
          <div className="flex-1"></div>
          <Button
            type="submit"
            className="w-1/3 p-2 bg-yellow-500 text-black hover:bg-yellow-600"
          >
            Edit Event
          </Button>
        </div>
      </form>
    </Form>
  );
}
