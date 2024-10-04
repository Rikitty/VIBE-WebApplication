import ProtectedLayout from "@/components/auth/protectedLayout";
import SignUpForm from "@/components/auth/signupForm";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <ProtectedLayout>
<h3>Hello</h3>      
    </ProtectedLayout>
  );
}
