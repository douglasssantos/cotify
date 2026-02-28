"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { mockQuotas, Quota } from "@/data/mock-quotas";
import { mockListings } from "@/data/mock-secondary-market";
import QuotaListCard from "@/components/marketplace/QuotaListCard";
import MarketplaceSidebar from "@/components/marketplace/MarketplaceSidebar";
import MarketplaceSidebarModal from "@/components/marketplace/MarketplaceSidebarModal";
import useMarketplaceStore from "@/store/marketplaceStore";
import useToggleStore from "@/store/toggleStore";

interface MarketplaceItem {
  quota: Quota;
  isRepasse: boolean;
  sellerName?: string;
  acceptsCounterOffer?: boolean;
  acceptsFinancing?: boolean;
}

const tabCategories = [
  "Todas as Categorias",
  "Imóveis",
  "Veículos",
  "Serviços",
  "Contempladas",
  "Repasses",
  "Ativas",
];

const sortOptions = [
  { value: "relevancia", title: "Relevância" },
  { value: "menor-preco", title: "Menor preço" },
  { value: "maior-preco", title: "Maior preço" },
  { value: "maior-credito", title: "Maior crédito" },
  { value: "menos-parcelas", title: "Menos parcelas" },
];

const ITEMS_PER_PAGE = 6;

export default function MarketplacePage() {
  const { filters, setSearch } = useMarketplaceStore();
  const listingToggle = useToggleStore((state) => state.listingToggleHandler);
  const [currentTab, setCurrentTab] = useState("Todas as Categorias");
  const [sortBy, setSortBy] = useState("relevancia");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [sortOpen, setSortOpen] = useState(false);

  const allItems: MarketplaceItem[] = useMemo(() => {
    const items: MarketplaceItem[] = [];

    mockQuotas.forEach((q) => {
      const listing = mockListings.find(
        (l) => l.quotaId === q.id && l.status === "ativo"
      );
      if (listing) {
        items.push({
          quota: { ...q, listingPrice: listing.askingPrice },
          isRepasse: true,
          sellerName: "Cotista Vendedor",
          acceptsCounterOffer: listing.acceptsCounterOffer,
          acceptsFinancing: listing.acceptsFinancing,
        });
      } else {
        items.push({ quota: q, isRepasse: false });
      }
    });

    mockListings
      .filter(
        (l) =>
          l.status === "ativo" && !mockQuotas.find((q) => q.id === l.quotaId)
      )
      .forEach((l) => {
        items.push({
          quota: {
            id: l.quotaId || l.id,
            groupCode: l.groupCode,
            goodType: l.goodType,
            goodTypeLabel: l.goodTypeLabel,
            creditValue: l.creditValue,
            paidAmount: l.paidAmount,
            installmentValue: l.installmentValue,
            remainingInstallments: l.remainingInstallments,
            totalInstallments: l.totalInstallments,
            status: l.isContemplada ? "contemplada" : "ativa",
            administradora: l.administradora,
            adminFee: l.adminFee,
            reserveFund: l.reserveFund,
            quotaNumber: l.quotaNumber,
            listingPrice: l.askingPrice,
          },
          isRepasse: true,
          sellerName: "Cotista Vendedor",
          acceptsCounterOffer: l.acceptsCounterOffer,
          acceptsFinancing: l.acceptsFinancing,
        });
      });

    return items;
  }, []);

  const filteredItems = allItems
    .filter((item) => {
      const q = item.quota;
      if (currentTab === "Todas as Categorias") return true;
      if (currentTab === "Imóveis") return q.goodType === "imovel";
      if (currentTab === "Veículos") return q.goodType === "veiculo";
      if (currentTab === "Serviços") return q.goodType === "servico";
      if (currentTab === "Contempladas") return q.status === "contemplada";
      if (currentTab === "Repasses") return item.isRepasse;
      if (currentTab === "Ativas") return q.status === "ativa";
      return true;
    })
    .filter((item) =>
      filters.goodType ? item.quota.goodType === filters.goodType : true
    )
    .filter((item) =>
      filters.status ? item.quota.status === filters.status : true
    )
    .filter((item) =>
      filters.administradora
        ? item.quota.administradora === filters.administradora
        : true
    )
    .filter((item) => {
      if (filters.priceRange.min === 0 && filters.priceRange.max === 1000000)
        return true;
      return (
        item.quota.creditValue >= filters.priceRange.min &&
        item.quota.creditValue <= filters.priceRange.max
      );
    })
    .filter((item) =>
      filters.search
        ? item.quota.groupCode
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          item.quota.administradora
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          item.quota.goodTypeLabel
            .toLowerCase()
            .includes(filters.search.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sortBy === "menor-preco")
        return (a.quota.listingPrice || 0) - (b.quota.listingPrice || 0);
      if (sortBy === "maior-preco")
        return (b.quota.listingPrice || 0) - (a.quota.listingPrice || 0);
      if (sortBy === "maior-credito")
        return b.quota.creditValue - a.quota.creditValue;
      if (sortBy === "menos-parcelas")
        return a.quota.remainingInstallments - b.quota.remainingInstallments;
      return 0;
    });

  const repasseCount = allItems.filter((i) => i.isRepasse).length;
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = () => {
    setSearch(searchInput);
    setCurrentPage(1);
  };

  const selectedSort =
    sortOptions.find((s) => s.value === sortBy)?.title || "Relevância";

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
                        onClick={() => {
                          setCurrentTab(item);
                          setCurrentPage(1);
                        }}
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
                  <a>Marketplace</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcumb9 */}
      <section className="breadcumb-section pt-0">
        <div className="cta-service-v1 cta-banner mx-auto maxw1700 pt120 pb120 bdrs16 position-relative overflow-hidden d-flex align-items-center mx20-lg px30-lg">
          <img
            className="left-top-img"
            src="/images/vector-img/left-top.png"
            alt=""
          />
          <img
            className="right-bottom-img"
            src="/images/vector-img/right-bottom.png"
            alt=""
          />
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
                  <h2>Marketplace de Cotas</h2>
                  <p className="text mb15">
                    Encontre as melhores oportunidades de consórcio com total
                    segurança.
                  </p>
                  <div className="d-flex gap-2 mb20 flex-wrap">
                    <span
                      className="text-white fz12 fw600 d-inline-flex align-items-center"
                      style={{
                        padding: "4px 14px",
                        borderRadius: 20,
                        backgroundColor: "#5bbb7b",
                      }}
                    >
                      <i className="fas fa-certificate me-1" /> Mercado
                      Primário
                    </span>
                    <span
                      className="text-white fz12 fw600 d-inline-flex align-items-center"
                      style={{
                        padding: "4px 14px",
                        borderRadius: 20,
                        backgroundColor: "#6f42c1",
                      }}
                    >
                      <i className="fas fa-exchange-alt me-1" />{" "}
                      {repasseCount} Repasses Disponíveis
                    </span>
                    <span
                      className="text-white fz12 fw600 d-inline-flex align-items-center"
                      style={{
                        padding: "4px 14px",
                        borderRadius: 20,
                        backgroundColor: "#0d6efd",
                      }}
                    >
                      <i className="fas fa-shield-alt me-1" /> Escrow Seguro
                    </span>
                  </div>
                </div>
                <div className="advance-search-tab bgc-white p10 bdrs4 zi1 position-relative">
                  <div className="row">
                    <div className="col-md-8 col-xl-9">
                      <div className="advance-search-field">
                        <form
                          className="form-search position-relative"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSearch();
                          }}
                        >
                          <div className="box-search bb1-sm">
                            <span className="icon far fa-magnifying-glass" />
                            <input
                              className="form-control"
                              type="text"
                              name="search"
                              placeholder="Buscar grupo, administradora, tipo de bem..."
                              value={searchInput}
                              onChange={(e) => setSearchInput(e.target.value)}
                            />
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="col-md-4 col-xl-3">
                      <div className="text-center text-xl-start">
                        <button
                          className="ud-btn btn-thm w-100"
                          type="button"
                          onClick={handleSearch}
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

      {/* Listing8 */}
      <section className="pt30 pb90">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <MarketplaceSidebar />
            </div>
            <div className="col-lg-9">
              {/* ListingOption2 */}
              <div className="row align-items-center mb20">
                <div className="col-md-6">
                  <div className="text-center text-md-start">
                    <p className="text mb-0 mb10-sm">
                      <span className="fw500">{filteredItems.length}</span>{" "}
                      cotas disponíveis
                      {currentTab === "Repasses" && (
                        <span
                          className="fz12 ms-1"
                          style={{ color: "#6f42c1" }}
                        >
                          (mercado secundário)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="page_control_shorting d-md-flex align-items-center justify-content-center justify-content-md-end">
                    <div className="dropdown-lists d-block d-lg-none me-2 mb10-sm">
                      <ul className="p-0 mb-0 text-center text-md-start">
                        <li>
                          <button
                            onClick={listingToggle}
                            type="button"
                            className="open-btn filter-btn-left"
                          >
                            <img
                              className="me-2"
                              src="/images/icon/all-filter-icon.svg"
                              alt="icon"
                            />
                            Filtros
                          </button>
                        </li>
                      </ul>
                    </div>
                    {/* SortOption1 */}
                    <div className="pcs_dropdown dark-color pr10 pr0-xs text-center">
                      <span>Ordenar</span>
                      <div
                        className={`dropdown bootstrap-select show-tick ${
                          sortOpen ? "open show" : ""
                        }`}
                      >
                        <button
                          type="button"
                          className="btn dropdown-toggle btn-light"
                          onClick={() => setSortOpen(!sortOpen)}
                        >
                          <div className="filter-option">
                            <div className="filter-option-inner">
                              <div className="filter-option-inner-inner">
                                {selectedSort}
                              </div>
                            </div>
                          </div>
                        </button>
                        <div
                          className={`dropdown-menu ${sortOpen ? "show" : ""}`}
                        >
                          <div className="inner show">
                            <ul className="dropdown-menu inner show">
                              {sortOptions.map((item, i) => (
                                <li key={i}>
                                  <a
                                    onClick={() => {
                                      setSortBy(item.value);
                                      setSortOpen(false);
                                    }}
                                    className={`dropdown-item ${
                                      item.value === sortBy
                                        ? "active selected"
                                        : ""
                                    }`}
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

              {/* Content */}
              <div className="row">
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((item) => (
                    <div key={item.quota.id} className="col-md-6 col-lg-12">
                      <QuotaListCard
                        data={item.quota}
                        isRepasse={item.isRepasse}
                        sellerName={item.sellerName}
                        acceptsCounterOffer={item.acceptsCounterOffer}
                        acceptsFinancing={item.acceptsFinancing}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <i
                      className="flaticon-loupe"
                      style={{ fontSize: 64, color: "#ccc" }}
                    />
                    <h4 className="mt20">Nenhuma cota encontrada</h4>
                    <p className="body-color">
                      Tente ajustar os filtros para encontrar mais resultados.
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination1 */}
              {totalPages > 1 && (
                <div className="mt30">
                  <div className="mbp_pagination text-center">
                    <ul className="page_navigation">
                      <li className="page-item">
                        <a
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <span className="fas fa-angle-left" />
                        </a>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <li
                            key={page}
                            className={`page-item ${
                              currentPage === page ? "active" : ""
                            }`}
                          >
                            <a
                              className="page-link"
                              onClick={() => setCurrentPage(page)}
                              style={{ cursor: "pointer" }}
                            >
                              {page}
                            </a>
                          </li>
                        )
                      )}
                      <li className="page-item">
                        <a
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <span className="fas fa-angle-right" />
                        </a>
                      </li>
                    </ul>
                    <p className="mt10 mb-0 pagination_page_count text-center">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1} –{" "}
                      {Math.min(
                        currentPage * ITEMS_PER_PAGE,
                        filteredItems.length
                      )}{" "}
                      de {filteredItems.length} cotas disponíveis
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ListingSidebarModal2 */}
      <MarketplaceSidebarModal />
    </>
  );
}
