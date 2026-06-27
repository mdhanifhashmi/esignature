import { SignatureList } from "@/components/dashboard/signature-list";
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome";

export default function DashboardPage() {
  return (
    <div>
      <DashboardWelcome />
      <SignatureList />
    </div>
  );
}
