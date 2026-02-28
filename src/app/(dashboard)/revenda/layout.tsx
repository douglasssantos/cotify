"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { revendaNavigation } from "@/data/navigation";

export default function RevendaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout navigation={revendaNavigation} sidebarTitle="Revenda">
      {children}
    </DashboardLayout>
  );
}
