"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { administradoraNavigation } from "@/data/navigation";

export default function AdministradoraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      navigation={administradoraNavigation}
      sidebarTitle="Administradora"
    >
      {children}
    </DashboardLayout>
  );
}
