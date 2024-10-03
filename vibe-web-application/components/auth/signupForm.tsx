"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import axiosInstance from "@/server/api/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "@/firebaseConfig"; 



import {
  Form,
  FormControl,
  FormField,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";

const signUpSchema = z.object({
  communityName: z.string({ required_error: "Community name required" }),
  userName: z.string({ required_error: "Username is required" }),
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(4, { message: "Minimum of 4 characters" }),
});

export default function SignUpForm() {
  const [checked, setChecked] = useState(false);
  function handleOnChange() {
    setChecked((prevState) => !prevState);
  }

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      communityName: "",
      userName: "",
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      const response = await axiosInstance.post("/register", values);
      toast({
        title: "Signup Success!",
        description: `Welcome, ${response.data.userName}! Your account has been created.`,
      });
    } catch (error: unknown) {
      console.error("Signup failed with error:", error.response?.data || error.message);
  
      toast({
        title: "Signup Failed!",
        description: error.response?.data?.error || "An unexpected error occurred. Please try again.",
      });
    }
  };  

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col items-start"
      >
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
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl className="w-[25rem] h-12">
                <Input placeholder="E.g Arjohn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl className="w-[25rem] h-12">
                <Input placeholder="aja@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <div className="flex-1 space-x-2">
          <Checkbox checked={checked} onCheckedChange={handleOnChange} />
          <label
            htmlFor="checked"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accept terms and conditions
          </label>
        </div>
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
