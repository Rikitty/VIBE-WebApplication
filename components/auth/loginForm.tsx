"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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
import Link from "next/link";
import { useRouter } from "next/navigation";

// Validation schema for form inputs
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(4, { message: "Password must be at least 4 characters long" }),
});

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const auth = getAuth(app); // Initialize Firebase Authentication

    try {
      // 1. Sign in user with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      // Success toast notification
      toast({
        title: "Login Success!",
        description: `Welcome back, ${user.email}!`,
      });

      // Redirect or update the UI for logged-in state here, e.g., router.push("/dashboard")
      router.push("/dashboard")

    } catch (error: any) {
      // Handle errors
      console.error("Login failed:", error);
      toast({
        title: "Login Failed!",
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

        {/* Submit Button */}
        <div className="flex items-center justify-center w-full">
          <Button type="submit" className="w-2/3 max-w-xs bg-yellow-400">
            Log In
          </Button>
        </div>
      </form>

      <FormDescription className="text-center my-4">
        Don't have an account?{" "}
        <Link href="/signup" className="text-blue-600">
          Sign Up
        </Link>
      </FormDescription>
    </Form>
  );
}
