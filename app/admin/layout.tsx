import { forbidden, unauthorized } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { getCurrentUser } from "@/actions/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) unauthorized();
  if (!user.isAdmin) forbidden();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50 p-6 lg:p-8">{children}</main>
    </div>
  );
}
