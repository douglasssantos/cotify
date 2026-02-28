"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  mockRepasses,
  repasseCategories,
  getConditionLabel,
  getConditionColor,
  getRepasseStatusLabel,
  getRepasseStatusColor,
  getCategoryIcon,
  type GoodCategory,
  type GoodCondition,
} from "@/data/mock-repasses";

const tabCategories = [
  { label: "Todos", value: "" },
  { label: "Veículos", value: "veiculo" },
  { label: "Imóveis", value: "imovel" },
  { label: "Motos", value: "moto" },
  { label: "Caminhões", value: "caminhao" },
];

const sortOptions = [
  { value: "recentes", title: "Mais recentes" },
  { value: "menor-preco", title: "Menor preço" },
  { value: "maior-preco", title: "Maior preço" },
  { value: "menor-km", title: "Menor km" },
  { value: "menor-parcela", title: "Menor parcela" },
];

const conditionOptions: { value: GoodCondition | ""; label: string }[] = [
  { value: "", label: "Todas" },
  { value: "excelente", label: "Excelente" },
  { value: "bom", label: "Bom" },
  { value: "regular", label: "Regular" },
];

const ITEMS_PER_PAGE = 6;

export default function RepassesPage() {
  const [currentTab, setCurrentTab] = useState("");
  const [sortBy, setSortBy] = useState("recentes");
  const [sortOpen, setSortOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [conditionFilter, setConditionFilter] = useState<GoodCondition | "">("");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000000);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = mockRepasses
    .filter((r) => r.status !== "vendido")
    .filter((r) => (currentTab ? r.category === currentTab : true))
    .filter((r) => (conditionFilter ? r.condition === conditionFilter : true))
    .filter((r) => r.askingPrice >= priceMin && r.askingPrice <= priceMax)
    .filter((r) =>
      search
        ? r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.description.toLowerCase().includes(search.toLowerCase()) ||
          r.creditLetter.administradora.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sortBy === "menor-preco") return a.askingPrice - b.askingPrice;
      if (sortBy === "maior-preco") return b.askingPrice - a.askingPrice;
      if (sortBy === "menor-km") {
        const kmA = a.vehicleDetails?.km ?? 999999;
        const kmB = b.vehicleDetails?.km ?? 999999;
        return kmA - kmB;
      }
      if (sortBy === "menor-parcela")
        return a.creditLetter.installmentValue - b.creditLetter.installmentValue;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const selectedSort = sortOptions.find((s) => s.value === sortBy)?.title || "Mais recentes";

  const handleSearch = () => {
    setSearch(searchInput);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Tabs */}
      <section className="categories_list_section overflow-hidden">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="listings_category_nav_list_menu">
                <ul className="mb0 d-flex ps-0">
                  <li>
                    <Link href="/marketplace">Cotas</Link>
                  </li>
                  <li>
                    <Link href="/marketplace/grupos">Grupos</Link>
                  </li>
                  <li>
                    <a className="active" style={{ cursor: "pointer" }}>Repasses</a>
                  </li>
                  <li>
                    <Link href="/marketplace/assembleias">Assembleias</Link>
                  </li>
                  <li>
                    <Link href="/simulador">Simulador</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="breadcumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <div className="breadcumb-list">
                  <Link href="/">Início</Link>
                  <Link href="/marketplace">Marketplace</Link>
                  <a>Repasses de Bens</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="breadcumb-section pt-0">
        <div className="cta-service-v1 cta-banner mx-auto maxw1700 pt120 pb120 bdrs16 position-relative overflow-hidden d-flex align-items-center mx20-lg px30-lg">
          <img className="left-top-img" src="/images/vector-img/left-top.png" alt="" />
          <img className="right-bottom-img" src="/images/vector-img/right-bottom.png" alt="" />
          <img
            className="service-v1-vector bounce-y d-none d-xl-block"
            src="/images/vector-img/vector-service.png"
            style={{ maxWidth: "450px" }}
            alt=""
          />
          <div className="container">
            <div className="row">
              <div className="col-xl-7">
                <div className="position-relative">
                  <h2>Repasses de Bens Consorciados</h2>
                  <p className="text mb15">
                    Encontre veículos, imóveis e outros bens adquiridos por consórcio.
                    Compre o bem e assuma as parcelas restantes com total segurança.
                  </p>
                  <div className="d-flex gap-2 mb20 flex-wrap">
                    {tabCategories.filter((t) => t.value).map((t) => {
                      const count = mockRepasses.filter(
                        (r) => r.category === t.value && r.status !== "vendido"
                      ).length;
                      return (
                        <span
                          key={t.value}
                          className="text-white fz12 fw600 d-inline-flex align-items-center"
                          style={{ padding: "4px 14px", borderRadius: 20, backgroundColor: "#6f42c1" }}
                        >
                          <i className={`${getCategoryIcon(t.value as GoodCategory)} me-1`} />
                          {count} {t.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="advance-search-tab bgc-white p10 bdrs4 zi1 position-relative">
                  <div className="row">
                    <div className="col-md-8 col-xl-9">
                      <div className="advance-search-field">
                        <form
                          className="form-search position-relative"
                          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                        >
                          <div className="box-search bb1-sm">
                            <span className="icon far fa-magnifying-glass" />
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Buscar por marca, modelo, tipo de bem..."
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

      {/* Content */}
      <section className="pt30 pb90">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3">
              <div className="list-sidebar-style1 d-none d-lg-block">
                <div className="accordion" id="sidebarAccordion">
                  {/* Category */}
                  <div className="card mb20 pb10">
                    <div className="card-header">
                      <h4 className="mb-0">Categoria</h4>
                    </div>
                    <div className="card-body">
                      {tabCategories.map((t) => (
                        <div key={t.value} className="checkbox-style1 mb15">
                          <label className="custom_checkbox">
                            {t.label}
                            <input
                              type="radio"
                              name="category"
                              checked={currentTab === t.value}
                              onChange={() => { setCurrentTab(t.value); setCurrentPage(1); }}
                            />
                            <span className="checkmark" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="card mb20 pb10">
                    <div className="card-header">
                      <h4 className="mb-0">Estado do Bem</h4>
                    </div>
                    <div className="card-body">
                      {conditionOptions.map((c) => (
                        <div key={c.value} className="checkbox-style1 mb15">
                          <label className="custom_checkbox">
                            {c.label}
                            <input
                              type="radio"
                              name="condition"
                              checked={conditionFilter === c.value}
                              onChange={() => { setConditionFilter(c.value); setCurrentPage(1); }}
                            />
                            <span className="checkmark" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="card mb20 pb10">
                    <div className="card-header">
                      <h4 className="mb-0">Faixa de Preço</h4>
                    </div>
                    <div className="card-body">
                      <div className="range-slider-style2">
                        <div className="d-flex gap-2 mb15">
                          <input
                            type="number"
                            className="form-control fz13"
                            placeholder="Mín"
                            value={priceMin || ""}
                            onChange={(e) => setPriceMin(Number(e.target.value) || 0)}
                          />
                          <input
                            type="number"
                            className="form-control fz13"
                            placeholder="Máx"
                            value={priceMax === 1000000 ? "" : priceMax}
                            onChange={(e) => setPriceMax(Number(e.target.value) || 1000000)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    className="ud-btn btn-thm ui-clear-btn w-100"
                    onClick={() => {
                      setCurrentTab("");
                      setConditionFilter("");
                      setPriceMin(0);
                      setPriceMax(1000000);
                      setSearch("");
                      setSearchInput("");
                      setCurrentPage(1);
                    }}
                  >
                    Limpar Filtros <i className="fal fa-arrow-right-long" />
                  </button>
                </div>
              </div>
            </div>

            {/* Listing */}
            <div className="col-lg-9">
              {/* Header */}
              <div className="row align-items-center mb20">
                <div className="col-md-6">
                  <p className="text mb-0 mb10-sm">
                    <span className="fw500">{filtered.length}</span> bens disponíveis para repasse
                  </p>
                </div>
                <div className="col-md-6">
                  <div className="page_control_shorting d-md-flex align-items-center justify-content-center justify-content-md-end">
                    <div className="pcs_dropdown dark-color pr10 pr0-xs text-center">
                      <span>Ordenar</span>
                      <div className={`dropdown bootstrap-select show-tick ${sortOpen ? "open show" : ""}`}>
                        <button
                          type="button"
                          className="btn dropdown-toggle btn-light"
                          onClick={() => setSortOpen(!sortOpen)}
                        >
                          <div className="filter-option">
                            <div className="filter-option-inner">
                              <div className="filter-option-inner-inner">{selectedSort}</div>
                            </div>
                          </div>
                        </button>
                        <div className={`dropdown-menu ${sortOpen ? "show" : ""}`}>
                          <div className="inner show">
                            <ul className="dropdown-menu inner show">
                              {sortOptions.map((item, i) => (
                                <li key={i}>
                                  <a
                                    onClick={() => { setSortBy(item.value); setSortOpen(false); }}
                                    className={`dropdown-item ${item.value === sortBy ? "active selected" : ""}`}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <span className="bs-ok-default check-mark" />
                                    <span className="text">{item.title}</span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div className="row">
                {paginated.length > 0 ? (
                  paginated.map((item) => {
                    const cl = item.creditLetter;
                    const paidPct = Math.round((cl.paidAmount / cl.creditValue) * 100);
                    return (
                      <div key={item.id} className="col-sm-6 col-xl-4 mb30">
                        <Link href={`/marketplace/repasses/${item.id}`} className="text-decoration-none">
                          <div className="listing-style1 bdr1 bdrs12 overflow-hidden" style={{ transition: "box-shadow 0.3s, transform 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                            {/* Image */}
                            <div className="position-relative overflow-hidden">
                              <img
                                className="w-100"
                                src={item.images[0]}
                                alt={item.title}
                                style={{ height: 210, objectFit: "cover", transition: "transform 0.4s" }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                              />
                              {/* Top badges */}
                              <div className="d-flex align-items-center gap-1" style={{ position: "absolute", top: 12, left: 12 }}>
                                <span className="text-white fz11 fw600" style={{ padding: "3px 10px", borderRadius: 20, backgroundColor: "#6f42c1", backdropFilter: "blur(4px)" }}>
                                  <i className={`${getCategoryIcon(item.category)} me-1`} />
                                  {item.categoryLabel}
                                </span>
                              </div>
                              {/* Bottom-left: condition */}
                              <span
                                className="text-white fz11 fw600"
                                style={{ position: "absolute", bottom: 12, left: 12, padding: "3px 10px", borderRadius: 20, backgroundColor: getConditionColor(item.condition) }}
                              >
                                {getConditionLabel(item.condition)}
                              </span>
                              {/* Bottom-right: photo count */}
                              {item.images.length > 1 && (
                                <span
                                  className="fz11 fw600 text-white d-flex align-items-center gap-1"
                                  style={{ position: "absolute", bottom: 12, right: 12, backgroundColor: "rgba(0,0,0,0.6)", padding: "3px 10px", borderRadius: 20, backdropFilter: "blur(4px)" }}
                                >
                                  <i className="fas fa-camera fz10" />
                                  {item.images.length}
                                </span>
                              )}
                              {/* Status badge top-right */}
                              {item.status !== "disponivel" && (
                                <span
                                  className="text-white fz11 fw600"
                                  style={{ position: "absolute", top: 12, right: 12, padding: "3px 10px", borderRadius: 20, backgroundColor: getRepasseStatusColor(item.status) }}
                                >
                                  {getRepasseStatusLabel(item.status)}
                                </span>
                              )}
                            </div>
                            {/* Content */}
                            <div className="p20">
                              <h6 className="mb5" style={{ color: "#222", lineHeight: 1.35, minHeight: 40 }}>{item.title}</h6>
                              <p className="body-color fz13 mb10">
                                <i className="flaticon-place fz13 vam text-thm2 me-1" />
                                {cl.administradora}
                              </p>
                              {/* Specs row */}
                              <div className="d-flex flex-wrap gap-3 mb12">
                                {item.vehicleDetails && (
                                  <>
                                    <div className="text-center">
                                      <i className="fas fa-tachometer-alt fz14 d-block mb3 text-thm2" />
                                      <span className="fz11 body-color">{item.vehicleDetails.km.toLocaleString("pt-BR")} km</span>
                                    </div>
                                    <div className="text-center">
                                      <i className="fas fa-gas-pump fz14 d-block mb3 text-thm2" />
                                      <span className="fz11 body-color">{item.vehicleDetails.fuel.split(" ")[0]}</span>
                                    </div>
                                    <div className="text-center">
                                      <i className="fas fa-cog fz14 d-block mb3 text-thm2" />
                                      <span className="fz11 body-color">{item.vehicleDetails.transmission.split(" ")[0]}</span>
                                    </div>
                                    <div className="text-center">
                                      <i className="fas fa-calendar fz14 d-block mb3 text-thm2" />
                                      <span className="fz11 body-color">{item.vehicleDetails.year}/{item.vehicleDetails.yearModel}</span>
                                    </div>
                                  </>
                                )}
                                {item.propertyDetails && (
                                  <>
                                    <div className="text-center">
                                      <i className="fas fa-ruler-combined fz14 d-block mb3 text-thm2" />
                                      <span className="fz11 body-color">{item.propertyDetails.area}m²</span>
                                    </div>
                                    <div className="text-center">
                                      <i className="fas fa-bed fz14 d-block mb3 text-thm2" />
                                      <span className="fz11 body-color">{item.propertyDetails.bedrooms} quartos</span>
                                    </div>
                                    <div className="text-center">
                                      <i className="fas fa-bath fz14 d-block mb3 text-thm2" />
                                      <span className="fz11 body-color">{item.propertyDetails.bathrooms} banheiros</span>
                                    </div>
                                    <div className="text-center">
                                      <i className="fas fa-parking fz14 d-block mb3 text-thm2" />
                                      <span className="fz11 body-color">{item.propertyDetails.parkingSpots} vagas</span>
                                    </div>
                                  </>
                                )}
                              </div>
                              {/* Progress bar */}
                              <div className="d-flex align-items-center mb12">
                                <div className="progress w-100" style={{ height: 4, borderRadius: 2, backgroundColor: "#eee" }}>
                                  <div className="progress-bar" style={{ width: `${paidPct}%`, borderRadius: 2, backgroundColor: "#5bbb7b" }} />
                                </div>
                                <span className="fz11 ms-2 body-color text-nowrap fw500">{paidPct}%</span>
                              </div>
                              {/* Price footer */}
                              <div className="d-flex align-items-end justify-content-between pt12" style={{ borderTop: "1px solid #f0f0f0" }}>
                                <div>
                                  <p className="fz11 body-color mb3">Valor do bem</p>
                                  <h5 className="mb-0" style={{ color: "#6f42c1" }}>{formatCurrency(item.askingPrice)}</h5>
                                </div>
                                <div className="text-end">
                                  <p className="fz11 body-color mb3">Parcela</p>
                                  <p className="mb-0 fz14 fw600">{formatCurrency(cl.installmentValue)}<span className="fz11 fw400 body-color">/mês</span></p>
                                  <p className="mb-0 fz11 body-color">{cl.remainingInstallments}x restantes</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12 text-center py-5">
                    <i className="flaticon-loupe" style={{ fontSize: 64, color: "#ccc" }} />
                    <h4 className="mt20">Nenhum bem encontrado</h4>
                    <p className="body-color">Tente ajustar os filtros para encontrar mais resultados.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt30">
                  <div className="mbp_pagination text-center">
                    <ul className="page_navigation">
                      <li className="page-item">
                        <a className="page-link" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} style={{ cursor: "pointer" }}>
                          <span className="fas fa-angle-left" />
                        </a>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                          <a className="page-link" onClick={() => setCurrentPage(page)} style={{ cursor: "pointer" }}>{page}</a>
                        </li>
                      ))}
                      <li className="page-item">
                        <a className="page-link" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} style={{ cursor: "pointer" }}>
                          <span className="fas fa-angle-right" />
                        </a>
                      </li>
                    </ul>
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
