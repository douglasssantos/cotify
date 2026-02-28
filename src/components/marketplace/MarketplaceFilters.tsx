"use client";

import useMarketplaceStore from "@/store/marketplaceStore";
import { goodTypes, quotaStatuses, administradoras } from "@/data/mock-quotas";

export default function MarketplaceFilters() {
  const { filters, setGoodType, setStatus, setAdministradora, setSearch, clearFilters } =
    useMarketplaceStore();

  const hasFilters =
    filters.status !== "" ||
    filters.goodType !== "" ||
    filters.administradora !== "" ||
    filters.search !== "";

  return (
    <div className="row align-items-center mb30">
      <div className="col-sm-6 col-md-3 mb15">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por grupo, administradora..."
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="col-sm-6 col-md-2 mb15">
        <select
          className="form-select"
          value={filters.goodType}
          onChange={(e) => setGoodType(e.target.value)}
        >
          {goodTypes.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className="col-sm-6 col-md-2 mb15">
        <select
          className="form-select"
          value={filters.status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {quotaStatuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className="col-sm-6 col-md-3 mb15">
        <select
          className="form-select"
          value={filters.administradora}
          onChange={(e) => setAdministradora(e.target.value)}
        >
          {administradoras.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className="col-sm-6 col-md-2 mb15">
        {hasFilters && (
          <button
            className="ud-btn btn-white bdrs4 w-100"
            onClick={clearFilters}
          >
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
}
