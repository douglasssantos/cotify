"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  headerNavigation,
  megaMenuCategories,
  publicNavigation,
} from "@/data/navigation";

export default function MobileNavigation() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  return (
    <div
      className="offcanvas offcanvas-start"
      tabIndex={-1}
      id="mobileNav"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title fw700 text-thm2">ConsórcioPro</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>
      <div className="offcanvas-body">
        <div className="mb20">
          <h6 className="fz14 fw600 mb10 text-uppercase">Categorias</h6>
          <ul className="list-unstyled ps-0">
            {megaMenuCategories.map((cat, ci) => (
              <li key={ci} className="mb-2">
                <a
                  className="d-flex align-items-center fz15 dark-color cursor-pointer"
                  onClick={() => setOpenMenu(openMenu === ci ? null : ci)}
                >
                  <span className={`${cat.icon} fz18 me-2`} />
                  <span className="fw500">{cat.title}</span>
                  <i
                    className={`fas fa-chevron-${
                      openMenu === ci ? "up" : "down"
                    } ms-auto fz12`}
                  />
                </a>
                {openMenu === ci && (
                  <ul className="list-unstyled ps-4 mt-2">
                    {cat.subCategories.map((sub) =>
                      sub.items.map((item, ii) => (
                        <li key={ii} className="mb-1">
                          <Link
                            className="fz14 body-color"
                            href={item.path}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <hr />
        <ul className="list-unstyled">
          {publicNavigation.map((item, i) => (
            <li key={i} className="mb-3">
              <Link
                className={`fz16 ${
                  pathname === item.path ? "text-thm" : "dark-color"
                }`}
                href={item.path || "/"}
              >
                {item.name}
              </Link>
            </li>
          ))}
          <hr />
          <li className="mb-3">
            <Link className="fz16 dark-color" href="/login">
              Entrar
            </Link>
          </li>
          <li>
            <Link className="ud-btn btn-thm w-100" href="/registro">
              Cadastrar
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
