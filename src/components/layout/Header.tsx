"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  headerNavigation,
  megaMenuCategories,
  NavItem,
} from "@/data/navigation";
import MobileNavigation from "./MobileNavigation";

function isActiveNav(pathname: string, item: NavItem): boolean {
  if (item.path && pathname === item.path) return true;
  if (item.path && pathname.startsWith(item.path) && item.path !== "/")
    return true;
  if (item.children) return item.children.some((c) => isActiveNav(pathname, c));
  return false;
}

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`header-nav main-menu ${
          isHomePage
            ? `nav-homepage-style stricky animated ${
                sticky ? "slideInDown stricky-fixed" : "slideIn"
              }`
            : "nav-innerpage-style"
        }`}
      >
        <nav className="posr">
          <div className="container-fluid posr menu_bdrt1">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto pe-0">
                <div className="d-flex align-items-center">
                  {isHomePage ? (
                    <div className="logos br-white-light pr30 pr5-xl">
                      <Link className="header-logo logo1" href="/">
                        <img
                          src="/images/header-logo.png"
                          alt="ConsórcioPro"
                        />
                      </Link>
                      <Link className="header-logo logo2" href="/">
                        <img
                          src="/images/header-logo.png"
                          alt="ConsórcioPro"
                        />
                      </Link>
                    </div>
                  ) : (
                    <Link className="header-logo bdrr1 pr30 pr5-xl" href="/">
                      <img
                        className="w-100 h-100 object-fit-contain"
                        src="/images/header-logo.png"
                        alt="ConsórcioPro"
                      />
                    </Link>
                  )}
                  {/* Mega Menu */}
                  <div className="home1_style d-none d-xl-block">
                    <div id="mega-menu">
                      <a className="btn-mega fw500">
                        <span className="pl30 pl10-xl pr5 fz15 vam flaticon-menu" />
                        Categorias
                      </a>
                      <ul className="menu ps-0">
                        {megaMenuCategories.map((cat, ci) => (
                          <li key={ci}>
                            <a className="dropdown">
                              <span className={`menu-icn ${cat.icon}`} />
                              <span className="menu-title">{cat.title}</span>
                            </a>
                            <div className="drop-menu d-flex justify-content-between">
                              {cat.subCategories.map((sub, si) => (
                                <div key={si} className="one-third">
                                  <div className="h6 cat-title">
                                    {sub.title}
                                  </div>
                                  <ul className="ps-0 mb-0">
                                    {sub.items.map((item, ii) => (
                                      <li key={ii}>
                                        <Link href={item.path}>
                                          {item.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-auto">
                <div className="d-flex align-items-center">
                  {/* Navigation */}
                  <ul className="ace-responsive-menu ui-navigation d-none d-lg-flex p-0 m-0">
                    {headerNavigation.map((item, i) => (
                      <li key={i} className="visible_list menu-active">
                        {item.children ? (
                          <a
                            className={`list-item ${
                              isActiveNav(pathname, item) ? "ui-active" : ""
                            }`}
                          >
                            <span className="title">{item.name}</span>
                            <span className="arrow" />
                          </a>
                        ) : (
                          <Link
                            href={item.path || "/"}
                            className={`list-item ${
                              isActiveNav(pathname, item) ? "ui-active" : ""
                            }`}
                          >
                            <span className="title">{item.name}</span>
                          </Link>
                        )}
                        {item.children && (
                          <ul className="sub-menu">
                            {item.children.map((child, ci) => (
                              <li
                                key={ci}
                                className={`menu-active ${
                                  isActiveNav(pathname, child)
                                    ? "ui-child-active"
                                    : ""
                                }`}
                              >
                                {child.children ? (
                                  <>
                                    <a>
                                      <span className="title">
                                        {child.name}
                                      </span>
                                      <span className="arrow" />
                                    </a>
                                    <ul className="sub-menu">
                                      {child.children.map((sub, si) => (
                                        <li
                                          key={si}
                                          className={
                                            pathname === sub.path
                                              ? "ui-child-active"
                                              : ""
                                          }
                                        >
                                          <Link href={sub.path || "/"}>
                                            {sub.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                ) : (
                                  <Link href={child.path || "/"}>
                                    <span className="title">{child.name}</span>
                                  </Link>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                  <a
                    className="login-info bdrl1 pl15-lg pl30 d-none d-lg-inline-block"
                    data-bs-toggle="modal"
                    href="#exampleModalToggle"
                  >
                    <span className="flaticon-loupe" />
                  </a>
                  <Link
                    className="login-info mx15-lg mx30 d-none d-md-inline-block"
                    href="/login"
                  >
                    Entrar
                  </Link>
                  <Link
                    className={`ud-btn ${
                      isHomePage ? "btn-white" : "btn-thm"
                    } add-joining d-none d-md-inline-block`}
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
