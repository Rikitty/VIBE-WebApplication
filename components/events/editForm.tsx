"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, ImageIcon, MapIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
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
    location: z.string({ required_error: "Location is required" }),
    details: z.string({ required_error: "Description is required" }),
    date_started: z.date({ required_error: "Start date required" }),
    date_ended: z.date({ required_error: "End date required" }),
    image: z.string().optional(),
  })
  .refine((data) => data.date_ended >= data.date_started, {
    message: "End date cannot be before the start date",
    path: ["date_ended"],
  });

type FormValues = z.infer<typeof editSchema>;

type EditFormProps = {
  id: string;
  eventData: any; // Define the shape of eventData if possible
};

export default function EditForm({ id, eventData }: EditFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: eventData?.title || "",
      location: eventData?.location || "",
      details: eventData?.details || "",
      date_started: eventData?.date_started
        ? eventData.date_started.toDate()
        : null,
      date_ended: eventData?.date_ended ? eventData.date_ended.toDate() : null,
      image: eventData?.image || "",
    },
  });

  useEffect(() => {
    if (eventData) {
      form.reset({
        title: eventData.title,
        location: eventData.location,
        details: eventData.details,
        date_started: eventData.date_started.toDate(),
        date_ended: eventData.date_ended.toDate(),
        image: eventData.image,
      });
    }
  }, [eventData, form]);

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
        user_id: user.uid,
        date_created: new Date().toISOString(),
      };

      const eventDocRef = doc(db, "events", id);
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
        description: "There was an error updating the event.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Event title"
                  className="w-full p-2 bg-transparent text-white rounded-md"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        {/* Additional form fields similar to the above for other data fields like 'location', 'details', etc. */}
        <Button type="submit" className="bg-yellow-500 text-black">
          Edit Event
        </Button>
      </form>
    </Form>
  );
}
