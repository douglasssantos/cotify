"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useToggleStore from "@/store/toggleStore";

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

interface DashboardHeaderProps {
  navigation?: NavItem[];
}

export default function DashboardHeader({ navigation }: DashboardHeaderProps) {
  const toggle = useToggleStore((state) => state.dashboardSidebarToggleHandler);
  const pathname = usePathname();

  return (
    <header className="header-nav nav-innerpage-style menu-home4 dashboard_header main-menu">
      <nav className="posr">
        <div className="container-fluid pr30 pr15-xs pl30 posr menu_bdrt1">
          <div className="row align-items-center justify-content-between">
            <div className="col-6 col-lg-auto">
              <div className="text-center text-lg-start d-flex align-items-center">
                <div className="dashboard_header_logo position-relative me-2 me-xl-5">
                  <Link href="/" className="logo">
                    <img
                      src="/images/header-logo-dark.svg"
                      alt="ConsórcioPro"
                    />
                  </Link>
                </div>
                <div className="fz20 ml90">
                  <a
                    onClick={toggle}
                    className="dashboard_sidebar_toggle_icon vam"
                    style={{ cursor: "pointer" }}
                  >
                    <i className="flaticon-menu fz20" />
                  </a>
                </div>
                <a
                  className="login-info d-block d-xl-none ml40 vam"
                  data-bs-toggle="modal"
                  href="#exampleModalToggle"
                >
                  <span className="flaticon-loupe" />
                </a>
                <div className="ml40 d-none d-xl-block">
                  <div className="search_area dashboard-style">
                    <input
                      type="text"
                      className="form-control border-0"
                      placeholder="Buscar grupo, cota ou cotista..."
                    />
                    <label>
                      <span className="flaticon-loupe" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-lg-auto">
              <div className="text-center text-lg-end header_right_widgets">
                <ul className="dashboard_dd_menu_list d-flex align-items-center justify-content-center justify-content-sm-end mb-0 p-0">
                  <li className="d-none d-sm-block">
                    <a
                      className="text-center mr5 text-thm2 dropdown-toggle fz20"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      <span className="flaticon-notification" />
                    </a>
                    <div className="dropdown-menu">
                      <div className="dboard_notific_dd px30 pt10 pb15">
                        <div className="notif_list d-flex align-items-center bdrb1 pb15 mb10">
                          <div className="details ml10">
                            <p className="text mb-0">Nova assembleia agendada</p>
                            <p className="text mb-0 fz12 text-thm">
                              Grupo GRP-4052
                            </p>
                          </div>
                        </div>
                        <div className="notif_list d-flex align-items-center bdrb1 pb15 mb10">
                          <div className="details ml10">
                            <p className="text mb-0">Transferência aprovada</p>
                            <p className="text mb-0 fz12 text-thm">Cota #12</p>
                          </div>
                        </div>
                        <div className="notif_list d-flex align-items-center">
                          <div className="details ml10">
                            <p className="text mb-0">Parcela paga com sucesso</p>
                            <p className="text mb-0 fz12 text-thm">
                              R$ 2.450,00
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="d-none d-sm-block">
                    <a
                      className="text-center mr5 text-thm2 dropdown-toggle fz20"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      <span className="flaticon-mail" />
                    </a>
                    <div className="dropdown-menu">
                      <div className="dboard_notific_dd px30 pt20 pb15">
                        <div className="notif_list d-flex align-items-start bdrb1 pb25 mb10">
                          <div className="details ml15">
                            <p className="dark-color fw500 mb-2">
                              Suporte ConsórcioPro
                            </p>
                            <p className="text mb-2">
                              Bem-vindo ao ConsórcioPro! Estamos aqui para
                              ajudar.
                            </p>
                            <p className="mb-0 text-thm">2 horas atrás</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="user_setting">
                    <div className="dropdown">
                      <a className="btn" role="button" data-bs-toggle="dropdown">
                        <img
                          src="/images/resource/user.png"
                          alt="user"
                        />
                      </a>
                      <div className="dropdown-menu">
                        <div className="user_setting_content">
                          {navigation && (
                            <>
                              <p className="fz15 fw400 ff-heading mb10 pl30">
                                Menu
                              </p>
                              {navigation.map((item, i) => (
                                <Link
                                  key={i}
                                  className={`dropdown-item ${
                                    pathname === item.path ? "active" : ""
                                  }`}
                                  href={item.path}
                                >
                                  <i className={`${item.icon} mr10`} />
                                  {item.name}
                                </Link>
                              ))}
                            </>
                          )}
                          <p className="fz15 fw400 ff-heading mt30 pl30">
                            Conta
                          </p>
                          <Link className="dropdown-item" href="/marketplace">
                            <i className="flaticon-shop mr10" />
                            Marketplace
                          </Link>
                          <Link className="dropdown-item" href="/">
                            <i className="flaticon-home mr10" />
                            Início
                          </Link>
                          <Link className="dropdown-item" href="/login">
                            <i className="flaticon-logout mr10" />
                            Sair
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
