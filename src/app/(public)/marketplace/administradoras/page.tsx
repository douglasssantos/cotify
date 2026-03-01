"use client";

import { useState } from "react";
import Link from "next/link";
import { mockGroups } from "@/data/mock-groups";
import { mockQuotas } from "@/data/mock-quotas";
import { formatCurrencyShort } from "@/lib/utils";
import { AdminLogo } from "@/components/marketplace/AdminLogo";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

/** Logo vinda do banco/estático; quando não houver, usa favicon do website */
const adminLogos: Record<string, string> = {
  // Embracon: "/images/partners/1.png",
  //"Porto Seguro": "/images/partners/2.png",
  // Rodobens: "/images/partners/3.png",
  // Bradesco: "/images/partners/4.png",
  // Itaú: "/images/partners/5.png",
  // "Banco do Brasil": "/images/partners/6.png",
};

/** Site da administradora (para buscar favicon quando não houver logo) */
const adminWebsites: Record<string, string> = {
  Embracon: "www.embracon.com.br",
  "Porto Seguro": "www.portoseguro.com.br",
  Rodobens: "www.rodobens.com.br",
  Bradesco: "www.bradesco.com.br",
  Itaú: "www.itauconsorcio.com.br",
  "Banco do Brasil": "www.bb.com.br/consorcio",
};

const sortOptions = [
  { value: "relevancia", label: "Relevância" },
  { value: "mais-grupos", label: "Mais Grupos" },
  { value: "mais-cotas", label: "Mais Cotas Disponíveis" },
  { value: "menor-taxa", label: "Menor Taxa Adm." },
];

function getAdminStats(name: string) {
  const groups = mockGroups.filter((g) => g.administradora === name);
  const quotas = mockQuotas.filter((q) => q.administradora === name);
  const activeGroups = groups.filter((g) => g.status === "em_andamento").length;
  const totalQuotas = groups.reduce((acc, g) => acc + g.totalQuotas, 0);
  const goodTypes = [...new Set(groups.map((g) => g.goodTypeLabel))];
  const minCredit = groups.length ? Math.min(...groups.map((g) => g.creditValue)) : 0;
  const maxCredit = groups.length ? Math.max(...groups.map((g) => g.creditValue)) : 0;
  const avgAdminFee = groups.length
    ? groups.reduce((acc, g) => acc + g.adminFee, 0) / groups.length
    : 0;

  return {
    groups: groups.length,
    activeGroups,
    quotasAvailable: quotas.length,
    totalQuotas,
    goodTypes,
    minCredit,
    maxCredit,
    avgAdminFee,
  };
}

const ITEMS_PER_PAGE = 6;

export default function AdministradorasPage() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("relevancia");
  const [sortOpen, setSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [locationDropdown, setLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

  const locations = ["São Paulo, SP", "Osasco, SP", "Brasília, DF", "Rio de Janeiro, RJ"];

  const uniqueAdmins = [...new Set(mockGroups.map((g) => g.administradora))].sort();

  const filteredAdmins = uniqueAdmins
    .filter((name) => (search ? name.toLowerCase().includes(search.toLowerCase()) : true))
    .sort((a, b) => {
      const sa = getAdminStats(a);
      const sb = getAdminStats(b);
      if (sortBy === "mais-grupos") return sb.groups - sa.groups;
      if (sortBy === "mais-cotas") return sb.quotasAvailable - sa.quotasAvailable;
      if (sortBy === "menor-taxa") return sa.avgAdminFee - sb.avgAdminFee;
      return 0;
    });

  const totalPages = Math.ceil(filteredAdmins.length / ITEMS_PER_PAGE);
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setSortBy("relevancia");
    setSelectedLocation("");
    setCurrentPage(1);
  };

  const selectedSortLabel =
    sortOptions.find((s) => s.value === sortBy)?.label || "Relevância";

  return (
    <>
      {/* TabSection1 */}

      {/* Breadcumb3 */}
      <section className="breadcumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <div className="breadcumb-list">
                  <Link href="/">Início</Link>
                  <Link href="/marketplace">Marketplace</Link>
                  <a>Administradoras</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcumb14 — Banner com busca */}
      <section className="breadcumb-section pt-0">
        <div className="cta-employee-single cta-banner mx-auto maxw1700 pt120 pt60-sm pb120 pb60-sm bdrs16 position-relative d-flex align-items-center overflow-hidden mx20-lg px30-lg">
          <img
            className="service-v1-vector at-job bounce-x d-none d-xl-block"
            src="/images/vector-img/administradora.png"
            style={{ maxWidth: "480px" }}
            alt=""
          />
          <div className="container">
            <div className="row">
              <div className="col-xl-7">
                <div className="position-relative">
                  <h2>Administradoras de Consórcio</h2>
                  <p className="text">
                    Encontre a administradora ideal para o seu consórcio. Veja grupos, cotas e condições.
                  </p>
                </div>
                <div className="advance-search-tab bgc-white p10 bdrs4 mt30">
                  <div className="row">
                    <div className="col-md-5 col-lg-6 col-xl-6">
                      <div className="advance-search-field bdrr1 bdrn-sm">
                        <div className="form-search position-relative">
                          <div className="box-search">
                            <span className="icon far fa-magnifying-glass" />
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Buscar administradora..."
                              value={searchInput}
                              onChange={(e) => setSearchInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  setSearch(searchInput);
                                  setCurrentPage(1);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-3">
                      <div className="bselect-style1 position-relative">
                        <div className="dropdown bootstrap-select w-100">
                          <button
                            type="button"
                            className="btn dropdown-toggle btn-light w-100 text-start"
                            onClick={(e) => { e.preventDefault(); setLocationDropdown(!locationDropdown); }}
                            onBlur={() => setTimeout(() => setLocationDropdown(false), 200)}
                          >
                            <div className="filter-option">
                              <div className="filter-option-inner">
                                <div className="filter-option-inner-inner">
                                  {selectedLocation || "Estado / Região"}
                                </div>
                              </div>
                            </div>
                          </button>
                          <div className={`dropdown-menu ${locationDropdown ? "show" : ""}`} style={{ position: "absolute", top: "100%", left: 0, marginTop: "2px" }}>
                            <div className="inner show">
                              <ul className="dropdown-menu inner show list-unstyled mb-0">
                                {locations.map((loc, i) => (
                                  <li key={i}>
                                    <button
                                      type="button"
                                      className={`dropdown-item w-100 text-start border-0 bg-transparent ${selectedLocation === loc ? "active" : ""}`}
                                      onClick={() => {
                                        setSelectedLocation(loc);
                                        setLocationDropdown(false);
                                      }}
                                    >
                                      <span className="text">{loc}</span>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-lg-2 col-xl-3">
                      <div className="text-center text-xl-start">
                        <button
                          className="ud-btn btn-thm2 w-100 vam"
                          onClick={() => { setSearch(searchInput); setCurrentPage(1); }}
                        >
                          Buscar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listing — Cards */}
      <section className="pt30 pb90">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {/* ListingOption2 */}
              <div className="row align-items-center mb20">
                <div className="col-md-6">
                  <div className="text-center text-md-start">
                    <p className="text mb-0 mb10-sm">
                      <span className="fw500">{filteredAdmins.length}</span>{" "}
                      administradoras disponíveis
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="page_control_shorting d-md-flex align-items-center justify-content-center justify-content-md-end">
                    <div className="pcs_dropdown dark-color d-flex align-items-center position-relative">
                      <span className="fz14 me-2">Ordenar:</span>
                      <div className="dropdown">
                        <button
                          className="btn dropdown-toggle btn-light fz14 fw500"
                          type="button"
                          onClick={(e) => { e.preventDefault(); setSortOpen(!sortOpen); }}
                          onBlur={() => setTimeout(() => setSortOpen(false), 200)}
                        >
                          {selectedSortLabel}
                        </button>
                        <ul className={`dropdown-menu list-unstyled mb-0 ${sortOpen ? "show" : ""}`} style={{ position: "absolute", right: 0, left: "auto", marginTop: "4px" }}>
                          {sortOptions.map((opt) => (
                            <li key={opt.value}>
                              <button
                                type="button"
                                className={`dropdown-item border-0 bg-transparent w-100 text-start ${sortBy === opt.value ? "active" : ""}`}
                                onClick={() => { setSortBy(opt.value); setSortOpen(false); setCurrentPage(1); }}
                              >
                                {opt.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* EmployeeCard1 grid */}
              {paginatedAdmins.length === 0 ? (
                <div className="text-center py-5">
                  <span className="flaticon-search fz50 text-thm2 d-block mb20" />
                  <h4>Nenhuma administradora encontrada</h4>
                  <p className="text">Tente ajustar os filtros ou a busca.</p>
                  <button className="ud-btn btn-thm mt10" onClick={clearFilters}>
                    Limpar Filtros <i className="fal fa-arrow-right-long" />
                  </button>
                </div>
              ) : (
                <div className="row">
                  {paginatedAdmins.map((name) => {
                    const stats = getAdminStats(name);
                    return (
                      <div key={name} className="col-sm-6 col-xl-4">
                        <Link
                          href={`/marketplace/administradoras/${slugify(name)}`}
                          className="job-list-style1 bdr1 pb20 pt20 d-block text-decoration-none admin-card-hover"
                          style={{ color: "inherit" }}
                        >
                          {/* icon + name (EmployeeCard1 pattern): logo do banco ou favicon do site */}
                          <div className="icon d-flex align-items-center mb10">
                            <AdminLogo
                              logo={adminLogos[name] ?? null}
                              website={adminWebsites[name] ?? null}
                              name={name}
                              size={52}
                            />
                            <h6 className="mb-0 ml20">{name}</h6>
                          </div>

                          {/* details */}
                          <div className="details">
                            <p className="mb-2">
                              <i className="fas fa-star fz10 review-color pr10" />
                              <span className="dark-color">4.8</span>
                              <span className="body-color ms-1">
                                ({stats.groups * 50}+ avaliações)
                              </span>
                            </p>
                            <p className="list-inline-item mb-3">
                              {stats.goodTypes.join(" · ")}
                            </p>
                            <p className="list-inline-item mb-3 bdrl1 pl15">
                              {stats.activeGroups} grupo{stats.activeGroups !== 1 ? "s" : ""}
                            </p>
                            <p className="list-inline-item mb-3 bdrl1 pl15">
                              {stats.quotasAvailable} cotas
                            </p>
                            {stats.minCredit > 0 && (
                              <p className="fz13 body-color mb10">
                                Crédito de{" "}
                                <span className="dark-color fw500">
                                  {formatCurrencyShort(stats.minCredit)}
                                </span>{" "}
                                a{" "}
                                <span className="dark-color fw500">
                                  {formatCurrencyShort(stats.maxCredit)}
                                </span>
                              </p>
                            )}
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination1 */}
              {totalPages > 1 && (
                <div className="row mt30">
                  <div className="mbp_pagination text-center w-100">
                    <ul className="page_navigation flex-wrap justify-content-center">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                          type="button"
                          className="page-link border-0 bg-transparent"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        >
                          <span className="fas fa-angle-left" />
                        </button>
                      </li>
                      {(() => {
                        const maxVisible = 5;
                        let pages: (number | "ellipsis")[] = [];
                        if (totalPages <= maxVisible + 2) {
                          pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                        } else {
                          pages = [1];
                          if (currentPage > 3) pages.push("ellipsis");
                          const start = Math.max(2, currentPage - 1);
                          const end = Math.min(totalPages - 1, currentPage + 1);
                          for (let p = start; p <= end; p++) {
                            if (!pages.includes(p)) pages.push(p);
                          }
                          if (currentPage < totalPages - 2) pages.push("ellipsis");
                          if (totalPages > 1) pages.push(totalPages);
                        }
                        return pages.map((page, i) =>
                          page === "ellipsis" ? (
                            <li key={`e-${i}`} className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          ) : (
                            <li
                              key={page}
                              className={`page-item ${currentPage === page ? "active" : ""}`}
                            >
                              <button
                                type="button"
                                className="page-link border-0 bg-transparent"
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                                {currentPage === page && <span className="sr-only">(atual)</span>}
                              </button>
                            </li>
                          )
                        );
                      })()}
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button
                          type="button"
                          className="page-link border-0 bg-transparent"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        >
                          <span className="fas fa-angle-right" />
                        </button>
                      </li>
                    </ul>
                    <p className="mt10 mb-0 pagination_page_count text-center">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredAdmins.length)} de {filteredAdmins.length} administradoras
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
