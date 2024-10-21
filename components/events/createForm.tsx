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
import { doc, setDoc, getDoc } from "firebase/firestore";
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

// Constants mapping
const ID = "id";
const UID = "user_id";
const COMMUNITYNAME = "community_name";
const NAME = "name";
const EMAIL = "email";
const TITLE = "title";
const DETAILS = "details";
const DATESTARTED = "date_started";
const DATEENDED = "date_ended";
const DATECREATED = "date_created";
const LOCATION = "location";
const TYPE = "type";
const IMAGE = "image";

const createSchema = z
  .object({
    [TITLE]: z.string({ required_error: "Title is required" }),
    [LOCATION]: z.string({ required_error: "Destination must be specified" }),
    [DETAILS]: z.string({ required_error: "Description is required" }),
    [DATESTARTED]: z.date({ required_error: "Start date required" }),
    [DATEENDED]: z.date({ required_error: "End date required" }),
    [IMAGE]: z.string().optional(),
  })
  .refine((data) => data[DATEENDED] >= data[DATESTARTED], {
    message: "End date cannot be before the start date",
    path: [DATEENDED],
  });

type FormValues = z.infer<typeof createSchema>;

export default function CreateForm() {
  const router = useRouter();
  const { user } = useAuth(); // Get the authenticated user
  const form = useForm<FormValues>({
    resolver: zodResolver(createSchema),
  });

  const [communityName, setCommunityName] = useState<string | null>(null); // State to store the community name

  useEffect(() => {
    if (user) {
      const fetchCommunityName = async () => {
        try {
          const userDocRef = doc(db, "tech_leaders", user.uid); // Assuming the 'tech_leaders' collection holds user info
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setCommunityName(userData?.[COMMUNITYNAME] || ""); // Set community name in state
          } else {
            console.error("No user document found!");
          }
        } catch (error) {
          console.error("Error fetching community name:", error);
        }
      };

      fetchCommunityName();
    }
  }, [user]);

  const { toast } = useToast();

  async function onSubmit(values: FormValues) {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create an event.",
      });
      return;
    }

    try {
      const newEvent = {
        ...values,
        [COMMUNITYNAME]: communityName, // Include the community_name from state
        [UID]: user.uid, // Set the user_Id to the current user's ID from context
        [DATECREATED]: new Date().toISOString(),
      };

      // Create the event document in Firestore
      const eventDocRef = doc(db, "events", newEvent.title); // Using the title as the document ID
      await setDoc(eventDocRef, newEvent);

      // Create subcollections for likes and joined
      const likesCollectionRef = doc(eventDocRef, "liked", "initial"); // Placeholder initial value, can be empty
      const joinedCollectionRef = doc(eventDocRef, "joined", "initial"); // Placeholder initial value, can be empty

      // Initialize the subcollections (could add an empty array or any default value if needed)
      await setDoc(likesCollectionRef, { user_ids: [] });
      await setDoc(joinedCollectionRef, { user_ids: [] });

      toast({
        title: "Event Created!",
        description: `Event "${newEvent.title}" has been created.`,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Event creation failed", error);
      toast({
        title: "Event Creation Failed!",
        description: `There was an error creating the event.`,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name={TITLE}
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
          name={DETAILS}
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
              name={DATESTARTED}
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
              name={DATEENDED}
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
            name={LOCATION}
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
                name={IMAGE}
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
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
