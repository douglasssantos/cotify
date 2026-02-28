"use client";

import { useState } from "react";
import Link from "next/link";
import {
  mockGroups,
  groupStatuses,
  groupAdministradoras,
  groupGoodTypes,
  getGroupStatusLabel,
  getGroupStatusClass,
} from "@/data/mock-groups";
import { formatCurrency } from "@/lib/utils";

const tabCategories = [
  "Todos os Grupos",
  "Imóveis",
  "Veículos",
  "Serviços",
  "Em Andamento",
  "Em Formação",
];

export default function GroupsPage() {
  const [currentTab, setCurrentTab] = useState("Todos os Grupos");
  const [filterGoodType, setFilterGoodType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAdm, setFilterAdm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const filteredGroups = mockGroups
    .filter((g) => {
      if (currentTab === "Todos os Grupos") return true;
      if (currentTab === "Imóveis") return g.goodType === "imovel";
      if (currentTab === "Veículos") return g.goodType === "veiculo";
      if (currentTab === "Serviços") return g.goodType === "servico";
      if (currentTab === "Em Andamento") return g.status === "em_andamento";
      if (currentTab === "Em Formação") return g.status === "formacao";
      return true;
    })
    .filter((g) => (filterGoodType ? g.goodType === filterGoodType : true))
    .filter((g) => (filterStatus ? g.status === filterStatus : true))
    .filter((g) => (filterAdm ? g.administradora === filterAdm : true))
    .filter((g) =>
      search
        ? g.code.toLowerCase().includes(search.toLowerCase()) ||
          g.administradora.toLowerCase().includes(search.toLowerCase()) ||
          (g.cooperativa || "").toLowerCase().includes(search.toLowerCase()) ||
          (g.comissionado || "").toLowerCase().includes(search.toLowerCase())
        : true
    );

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const clearFilters = () => {
    setFilterGoodType("");
    setFilterStatus("");
    setFilterAdm("");
    setSearch("");
    setSearchInput("");
  };

  const hasFilters = filterGoodType || filterStatus || filterAdm || search;

  return (
    <>
      {/* TabSection1 */}
      <section className="categories_list_section overflow-hidden">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="listings_category_nav_list_menu">
                <ul className="mb0 d-flex ps-0">
                  {tabCategories.map((item, i) => (
                    <li key={i}>
                      <a
                        onClick={() => setCurrentTab(item)}
                        className={currentTab === item ? "active" : ""}
                        style={{ cursor: "pointer" }}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcumb3 */}
      <section className="breadcumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <div className="breadcumb-list">
                  <Link href="/">Início</Link>
                  <Link href="/marketplace">Marketplace</Link>
                  <a>Grupos</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcumb9 */}
      <section className="breadcumb-section pt-0">
        <div className="cta-service-v1 cta-banner mx-auto maxw1700 pt120 pb120 bdrs16 position-relative overflow-hidden d-flex align-items-center mx20-lg px30-lg">
          <img className="left-top-img" src="/images/vector-img/left-top.png" alt="" />
          <img className="right-bottom-img" src="/images/vector-img/right-bottom.png" alt="" />
          <img className="service-v1-vector bounce-y d-none d-xl-block" src="/images/vector-img/vector-service-v1.png" alt="" />
          <div className="container">
            <div className="row">
              <div className="col-xl-7">
                <div className="position-relative">
                  <h2>Grupos de Consórcio</h2>
                  <p className="text mb30">
                    Acompanhe os grupos das administradoras, cooperativas e revendas parceiras.
                  </p>
                </div>
                <div className="advance-search-tab bgc-white p10 bdrs4 zi1 position-relative">
                  <div className="row">
                    <div className="col-md-8 col-xl-9">
                      <div className="advance-search-field">
                        <form className="form-search position-relative" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                          <div className="box-search bb1-sm">
                            <span className="icon far fa-magnifying-glass" />
                            <input
                              className="form-control"
                              type="text"
                              name="search"
                              placeholder="Buscar grupo, administradora, cooperativa..."
                              value={searchInput}
                              onChange={(e) => setSearchInput(e.target.value)}
                            />
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="col-md-4 col-xl-3">
                      <div className="text-center text-xl-start">
                        <button className="ud-btn btn-thm w-100" type="button" onClick={handleSearch}>
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

      {/* Listing */}
      <section className="pt30 pb90">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3">
              <div className="list-sidebar-style1 d-none d-lg-block">
                <div className="accordion" id="accordionGroups">
                  {/* Tipo de Bem */}
                  <div className="card mb20 pb10 mt-0">
                    <div className="card-header" id="hGoodType">
                      <h4>
                        <button className="btn btn-link ps-0 pt-0" type="button">
                          Tipo de Bem
                        </button>
                      </h4>
                    </div>
                    <div className="collapse show">
                      <div className="card-body card-body px-0 pt-0">
                        <div className="checkbox-style1 mb15">
                          {groupGoodTypes.filter((g) => g.value !== "").map((item, i) => (
                            <label key={i} className="custom_checkbox">
                              {item.label}
                              <input
                                type="checkbox"
                                checked={filterGoodType === item.value}
                                onChange={() => setFilterGoodType(filterGoodType === item.value ? "" : item.value)}
                              />
                              <span className="checkmark" />
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="card mb20 pb10">
                    <div className="card-header" id="hStatus">
                      <h4>
                        <button className="btn btn-link ps-0" type="button">
                          Status do Grupo
                        </button>
                      </h4>
                    </div>
                    <div className="collapse show">
                      <div className="card-body card-body px-0 pt-0">
                        {groupStatuses.filter((s) => s.value !== "").map((item, i) => (
                          <div key={i} className="switch-style1">
                            <div className="form-check form-switch mb20">
                              <input
                                className="form-check-input mt-0"
                                type="checkbox"
                                id={`gStatus-${item.value}`}
                                checked={filterStatus === item.value}
                                onChange={() => setFilterStatus(filterStatus === item.value ? "" : item.value)}
                              />
                              <label className="form-check-label mt-0" htmlFor={`gStatus-${item.value}`}>
                                {item.label}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Administradora */}
                  <div className="card mb20 pb5">
                    <div className="card-header" id="hAdm">
                      <h4>
                        <button className="btn btn-link ps-0" type="button">
                          Administradora
                        </button>
                      </h4>
                    </div>
                    <div className="collapse show">
                      <div className="card-body card-body px-0 pt-0">
                        <div className="checkbox-style1 mb15">
                          {groupAdministradoras.filter((a) => a.value !== "").map((item, i) => (
                            <label key={i} className="custom_checkbox">
                              {item.label}
                              <input
                                type="checkbox"
                                checked={filterAdm === item.value}
                                onChange={() => setFilterAdm(filterAdm === item.value ? "" : item.value)}
                              />
                              <span className="checkmark" />
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {hasFilters && (
                  <button onClick={clearFilters} className="ud-btn btn-thm ui-clear-btn w-100">
                    Limpar Filtros
                    <i className="fal fa-arrow-right-long" />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="col-lg-9">
              <div className="row align-items-center mb20">
                <div className="col-md-6">
                  <div className="text-center text-md-start">
                    <p className="text mb-0 mb10-sm">
                      <span className="fw500">{filteredGroups.length}</span> grupos encontrados
                    </p>
                  </div>
                </div>
              </div>

              <div className="row">
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((group) => {
                    const progressPercent = Math.round((group.currentAssembly / group.term) * 100);
                    return (
                      <div key={group.id} className="col-md-6 col-lg-12">
                        <div className="freelancer-style1 bdr1 hover-box-shadow row ms-0 align-items-lg-center">
                          <div className="col-lg-8 ps-0">
                            <div className="d-lg-flex bdrr1 bdrn-xl pr15 pr0-lg">
                              <div className="thumb w60 position-relative rounded-circle mb15-md">
                                <div
                                  className="rounded-circle mx-auto d-flex align-items-center justify-content-center bgc-thm2"
                                  style={{ width: 60, height: 60 }}
                                >
                                  <i className={`${group.goodType === "imovel" ? "flaticon-home" : group.goodType === "veiculo" ? "fas fa-car" : "flaticon-briefcase"} text-white fz20`} />
                                </div>
                              </div>
                              <div className="details ml15 ml0-md mb15-md">
                                <h5 className="title mb-3">
                                  {group.code} — {formatCurrency(group.creditValue)}
                                </h5>
                                <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                                  <i className="flaticon-place fz16 vam text-thm2 me-1" />
                                  {group.administradora}
                                </p>
                                {group.cooperativa && (
                                  <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                                    <i className="flaticon-user fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
                                    {group.cooperativa}
                                  </p>
                                )}
                                {group.comissionado && (
                                  <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                                    <i className="flaticon-shop fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
                                    {group.comissionado}
                                  </p>
                                )}
                                <div className="d-flex align-items-center mt10 mb10" style={{ maxWidth: 300 }}>
                                  <div className="progress w-100" style={{ height: 6 }}>
                                    <div className="progress-bar bgc-thm" style={{ width: `${progressPercent}%` }} />
                                  </div>
                                  <span className="fz12 ml10 body-color text-nowrap">
                                    {progressPercent}% ({group.currentAssembly}/{group.term})
                                  </span>
                                </div>
                                <div className="skill-tags d-flex align-items-center justify-content-start">
                                  <span className={`tag ${getGroupStatusClass(group.status)}`}>
                                    {getGroupStatusLabel(group.status)}
                                  </span>
                                  <span className="tag mx10">{group.goodTypeLabel}</span>
                                  <span className="tag">
                                    {group.contemplatedQuotas}/{group.totalQuotas} contempladas
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 ps-0 ps-xl-3 pe-0">
                            <div className="details">
                              <div className="text-lg-end">
                                <h4>{group.totalQuotas} cotas</h4>
                                <p className="text">Próx. assembleia: {group.nextAssemblyDate !== "-" ? new Date(group.nextAssemblyDate).toLocaleDateString("pt-BR") : "Encerrado"}</p>
                              </div>
                              <div className="d-grid mt15">
                                <Link href={`/marketplace/grupos/${group.id}`} className="ud-btn btn-light-thm">
                                  Ver Grupo
                                  <i className="fal fa-arrow-right-long" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12 text-center py-5">
                    <i className="flaticon-loupe" style={{ fontSize: 64, color: "#ccc" }} />
                    <h4 className="mt20">Nenhum grupo encontrado</h4>
                    <p className="body-color">Tente ajustar os filtros.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
