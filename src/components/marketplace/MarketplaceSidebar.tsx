"use client";

import { useState } from "react";
import useMarketplaceStore from "@/store/marketplaceStore";
import { goodTypes, quotaStatuses, administradoras } from "@/data/mock-quotas";

const goodTypeCounts: Record<string, number> = {
  "": 8,
  imovel: 4,
  veiculo: 3,
  servico: 1,
};

const statusCounts: Record<string, number> = {
  "": 8,
  ativa: 4,
  contemplada: 3,
  cancelada: 1,
};

export default function MarketplaceSidebar() {
  const {
    filters,
    setGoodType,
    setStatus,
    setAdministradora,
    setPriceRange,
    setSearch,
    clearFilters,
  } = useMarketplaceStore();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    goodType: true,
    status: true,
    price: true,
    administradora: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const hasFilters =
    filters.status !== "" ||
    filters.goodType !== "" ||
    filters.administradora !== "" ||
    filters.search !== "" ||
    filters.priceRange.min !== 0 ||
    filters.priceRange.max !== 1000000;

  return (
    <div className="list-sidebar-style1 d-none d-lg-block">
      <div className="accordion" id="accordionExample">
        {/* Tipo de Bem - checkbox style like CategoryOption1 */}
        <div className="card mb20 pb10 mt-0">
          <div className="card-header" id="heading0">
            <h4>
              <button
                className={`btn btn-link ps-0 pt-0 ${openSections.goodType ? "" : "collapsed"}`}
                type="button"
                onClick={() => toggleSection("goodType")}
              >
                Tipo de Bem
              </button>
            </h4>
          </div>
          <div className={`collapse ${openSections.goodType ? "show" : ""}`}>
            <div className="card-body card-body px-0 pt-0">
              <div className="checkbox-style1 mb15">
                {goodTypes.filter((g) => g.value !== "").map((item, i) => (
                  <label key={i} className="custom_checkbox">
                    {item.label}
                    <input
                      type="checkbox"
                      checked={filters.goodType === item.value}
                      onChange={() =>
                        setGoodType(filters.goodType === item.value ? "" : item.value)
                      }
                    />
                    <span className="checkmark" />
                    <span className="right-tags">
                      ({goodTypeCounts[item.value] || 0})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status - switch style like ProjectTypeOption1 */}
        <div className="card mb20 pb10">
          <div className="card-header" id="heading01">
            <h4>
              <button
                className={`btn btn-link ps-0 ${openSections.status ? "" : "collapsed"}`}
                type="button"
                onClick={() => toggleSection("status")}
              >
                Status da Cota
              </button>
            </h4>
          </div>
          <div className={`collapse ${openSections.status ? "show" : ""}`}>
            <div className="card-body card-body px-0 pt-0">
              {quotaStatuses.filter((s) => s.value !== "").map((item, i) => (
                <div key={i} className="switch-style1">
                  <div className="form-check form-switch mb20">
                    <input
                      className="form-check-input mt-0"
                      type="checkbox"
                      id={`switchStatus-${item.value}`}
                      checked={filters.status === item.value}
                      onChange={() =>
                        setStatus(filters.status === item.value ? "" : item.value)
                      }
                    />
                    <label
                      className="form-check-label mt-0"
                      htmlFor={`switchStatus-${item.value}`}
                    >
                      {item.label}
                    </label>
                    <span className="right-tags">
                      ({statusCounts[item.value] || 0})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Faixa de Crédito - price style like BudgetOption2 */}
        <div className="card mb20 pb0">
          <div className="card-header" id="heading1">
            <h4>
              <button
                className={`btn btn-link ps-0 ${openSections.price ? "" : "collapsed"}`}
                type="button"
                onClick={() => toggleSection("price")}
              >
                Faixa de Crédito
              </button>
            </h4>
          </div>
          <div className={`collapse ${openSections.price ? "show" : ""}`}>
            <div className="card-body card-body px-0 pt-4">
              <div className="range-slider-style2">
                <div className="range-wrapper">
                  <div className="d-flex gap-1 align-items-center">
                    <input
                      type="number"
                      className="amount w-100"
                      placeholder="R$ 0"
                      min={0}
                      value={filters.priceRange.min || ""}
                      onChange={(e) =>
                        setPriceRange(
                          Number(e.target.value) || 0,
                          filters.priceRange.max
                        )
                      }
                    />
                    <span className="fa-sharp fa-solid fa-minus mx-1 dark-color" />
                    <input
                      type="number"
                      className="amount2 w-100"
                      placeholder="R$ 1.000.000"
                      min={0}
                      value={filters.priceRange.max === 1000000 ? "" : filters.priceRange.max}
                      onChange={(e) =>
                        setPriceRange(
                          filters.priceRange.min,
                          Number(e.target.value) || 1000000
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Administradora - checkbox style like LocationOption1 */}
        <div className="card mb20 pb5">
          <div className="card-header" id="heading2">
            <h4>
              <button
                className={`btn btn-link ps-0 ${openSections.administradora ? "" : "collapsed"}`}
                type="button"
                onClick={() => toggleSection("administradora")}
              >
                Administradora
              </button>
            </h4>
          </div>
          <div className={`collapse ${openSections.administradora ? "show" : ""}`}>
            <div className="card-body card-body px-0 pt-0">
              <div className="default-box-shadow1 mb15">
                <div className="search_area">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar"
                    value={filters.search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <label>
                    <span className="flaticon-loupe" />
                  </label>
                </div>
              </div>
              <div className="checkbox-style1 mb15">
                {administradoras.filter((a) => a.value !== "").map((item, i) => (
                  <label key={i} className="custom_checkbox">
                    {item.label}
                    <input
                      type="checkbox"
                      checked={filters.administradora === item.value}
                      onChange={() =>
                        setAdministradora(
                          filters.administradora === item.value ? "" : item.value
                        )
                      }
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
        <button
          onClick={clearFilters}
          className="ud-btn btn-thm ui-clear-btn w-100"
        >
          Limpar Filtros
          <i className="fal fa-arrow-right-long" />
        </button>
      )}
    </div>
  );
}
