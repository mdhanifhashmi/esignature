import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { MotionBackground } from "@/components/landing/motion-background";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-mesh-purple px-4">
      <MotionBackground />
      <div className="relative z-10">
        <Suspense>
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </div>
  );
}
