"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { cooperativaNavigation } from "@/data/navigation";

export default function CooperativaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      navigation={cooperativaNavigation}
      sidebarTitle="Cooperativa"
    >
      {children}
    </DashboardLayout>
  );
}
