"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

interface DashboardSidebarProps {
  navigation: NavItem[];
  title: string;
}

export default function DashboardSidebar({ navigation, title }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="dashboard__sidebar d-none d-lg-block">
      <div className="dashboard_sidebar_list">
        <p className="fz15 fw400 ff-heading pl30">{title}</p>
        {navigation.map((item, i) => (
          <div key={i} className="sidebar_list_item mb-1">
            <Link
              href={item.path}
              className={`items-center ${
                pathname === item.path ? "-is-active" : ""
              }`}
            >
              <i className={`${item.icon} mr15`} />
              {item.name}
            </Link>
          </div>
        ))}
        <p className="fz15 fw400 ff-heading pl30 mt30">Conta</p>
        <div className="sidebar_list_item mb-1">
          <Link href="/marketplace" className="items-center">
            <i className="flaticon-shop mr15" />
            Marketplace
          </Link>
        </div>
        <div className="sidebar_list_item mb-1">
          <Link href="/login" className="items-center">
            <i className="flaticon-logout mr15" />
            Sair
          </Link>
        </div>
      </div>
    </div>
  );
}
