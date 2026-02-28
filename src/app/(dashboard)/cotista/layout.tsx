"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { cotistaNavigation } from "@/data/navigation";

export default function CotistaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout navigation={cotistaNavigation} sidebarTitle="Cotista">
      {children}
    </DashboardLayout>
  );
}
