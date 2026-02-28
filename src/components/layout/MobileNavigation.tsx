"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { publicNavigation } from "@/data/navigation";

export default function MobileNavigation() {
  const pathname = usePathname();

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
        <ul className="list-unstyled">
          {publicNavigation.map((item, i) => (
            <li key={i} className="mb-3">
              <Link
                className={`fz16 ${pathname === item.path ? "text-thm" : "dark-color"}`}
                href={item.path}
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
