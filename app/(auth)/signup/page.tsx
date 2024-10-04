import SignUpForm from "@/components/auth/signupForm";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignUp() {
  return (

    <div className="bg-gray-600" style={{
      backgroundImage: 'url("/assets/background.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      
}}>
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Place image below here */}
      

      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <img src="/assets/6.png" alt="Logo" className="absolute top-10 mb-4 w-50 h-48"/>
        <div className="absolute bottom-0 min-h-96">
          <Card className="w-[38rem] h-[45rem]">
            <CardHeader className="flex items-center">
              <CardTitle className="scroll-m-20 pb-2 text-4xl font-normal tracking-wide first:mt-0 text-yellow-400">
                Create an Account
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center flex-col">
              <SignUpForm />
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}