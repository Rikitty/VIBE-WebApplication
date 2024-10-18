"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "@/lib/firebaseConfig"; // Firebase config is centralized here.

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";

// Validation schema for form inputs
const signUpSchema = z.object({
  communityName: z.string({ required_error: "Community name is required" }),
  userName: z.string({ required_error: "Username is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(4, { message: "Password must be at least 4 characters long" }),
});

export default function SignUpForm() {
  const [checked, setChecked] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      communityName: "",
      userName: "",
      email: "",
      password: "",
    },
  });

  function handleOnChange() {
    setChecked((prevState) => !prevState);
  }

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    const auth = getAuth(app); // Initialize Firebase Authentication
    const db = getFirestore(app); // Initialize Firestore

    try {
      // 1. Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      // 2. Store user data in Firestore
      await setDoc(doc(db, "tech_leaders", user.uid), {
        community_name: values.communityName,
        name: values.userName,
        email: values.email,
        user_id: user.uid,
      });

      // Success toast notification
      toast({
        title: "Signup Success!",
        description: `Welcome, ${values.userName}! Your account has been created.`,
      });
    } catch (error: any) {
      // Handle errors
      console.error("Signup failed:", error);
      toast({
        title: "Signup Failed!",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col items-start"
      >
        {/* Community Name */}
        <FormField
          control={form.control}
          name="communityName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Community Name</FormLabel>
              <FormControl className="w-[25rem] h-12">
                <Input placeholder="Community Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Username */}
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl className="w-[25rem] h-12">
                <Input placeholder="E.g. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl className="w-[25rem] h-12">
                <Input placeholder="example@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl className="w-[25rem] h-12">
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Checkbox for Terms and Conditions */}
        <div className="flex-1 space-x-2">
          <Checkbox checked={checked} onCheckedChange={handleOnChange} />
          <label
            htmlFor="checked"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accept terms and conditions
          </label>  
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-center w-full">
          <Button disabled={!checked} type="submit" className="w-2/3 max-w-xs bg-yellow-400">
            Create account
          </Button>
        </div>
      </form>

      <FormDescription className="text-center my-4">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600">
          Login
        </Link>
      </FormDescription>
    </Form>
  );
}
