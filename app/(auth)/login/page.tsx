import LoginForm from "@/components/auth/loginForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link"; // Adjust based on your routing library

export default function Login() {
  return (
    <div
      className="flex min-h-screen flex-row items-center justify-between p-24 bg-gray-600"
      style={{
        backgroundImage: 'url("/assets/background.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="absolute left-56 top-1/4">
        <h1 className="text-2xl font-normal text-yellow-400">
          <em>Welcome to</em>
        </h1>
        <img src="/assets/6.png" alt="Logo" className="mb-4 w-50 h-[23rem]" />
      </div>

      <div className="absolute min-h-80 bottom-0 right-56">
        <Card className="w-[40rem] h-[52rem] bg-gray-100">
          <CardHeader className="flex items-center">
            <CardTitle className="scroll-m-20 pb-2 mb-10 pt-9 text-yellow-400 text-4xl font-normal tracking-tight first:mt-0">
              Log in
            </CardTitle>
          </CardHeader>

          <CardContent className="flex items-center flex-col">
            <LoginForm />
          </CardContent>

          <div className="text-center my-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600">
              Sign up
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

// image: ["https://cdn.pixabay.com/photo/2016/09/08/18/45/cube-1655118_640.jpg"],