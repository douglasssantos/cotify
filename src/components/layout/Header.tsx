"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { publicNavigation } from "@/data/navigation";
import MobileNavigation from "./MobileNavigation";

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      <header
        className={`header-nav nav-innerpage-style ${
          isHomePage ? "at-home20" : ""
        } main-menu border-0`}
      >
        <nav className="posr">
          <div className="container-fluid custom-container custom-container2 posr">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto px-0 px-xl-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="logos">
                    <Link className="header-logo logo1" href="/">
                      <img
                        src="/images/header-logo-dark2.svg"
                        alt="ConsórcioPro"
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-auto px-0 px-xl-3">
                <div className="d-none d-lg-block">
                  <ul className="ace-responsive-menu p-0 m-0 list-unstyled d-flex">
                    {publicNavigation.map((item, i) => (
                      <li key={i} className="visible_list">
                        <Link
                          className={`list-item ${
                            pathname === item.path ? "text-thm" : ""
                          }`}
                          href={item.path}
                        >
                          <span className="title">{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-auto pe-0">
                <div className="d-flex align-items-center">
                  <Link
                    className="login-info mr10 home18-sign-btn px30 py-1 bdrs12 ml30 bdr1-dark d-none d-md-inline-block"
                    href="/login"
                  >
                    Entrar
                  </Link>
                  <Link
                    className="ud-btn add-joining home20-join-btn bdrs12 text-white d-none d-md-inline-block"
                    href="/registro"
                  >
                    Cadastrar
                  </Link>
                  <button
                    className="d-lg-none btn p-0 fz20 ml15"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#mobileNav"
                  >
                    <span className="flaticon-menu" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <MobileNavigation />
    </>
  );
}
