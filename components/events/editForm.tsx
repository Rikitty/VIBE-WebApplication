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

    fetchEventData();
  }, [eventId, form, router, toast]);

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
        userId: user.uid,
        updatedAt: new Date().toISOString(),
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
                <Input {...field} placeholder="Event title" />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Separator />

        {/* Other fields... */}
        {/* Submit button */}
        <Button type="submit">Update Event</Button>
      </form>
    </Form>
  );
}
