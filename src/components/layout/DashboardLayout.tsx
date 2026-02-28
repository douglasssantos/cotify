"use client";

import useToggleStore from "@/store/toggleStore";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import DashboardFooter from "./DashboardFooter";

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navigation: NavItem[];
  sidebarTitle: string;
}

export default function DashboardLayout({
  children,
  navigation,
  sidebarTitle,
}: DashboardLayoutProps) {
  const isActive = useToggleStore((state) => state.isDashboardSidebarActive);

  return (
    <>
      <DashboardHeader navigation={navigation} />
      <div className="dashboard_content_wrapper">
        <div
          className={`dashboard dashboard_wrapper pr30 pr0-xl ${
            isActive ? "dsh_board_sidebar_hidden" : ""
          }`}
        >
          <DashboardSidebar navigation={navigation} title={sidebarTitle} />
          <div className="dashboard__main pl0-md">
            {children}
            <DashboardFooter />
          </div>
        </div>
      </div>
    </>
  );
}
