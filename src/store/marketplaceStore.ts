import { create } from "zustand";

interface MarketplaceFilters {
  status: string;
  goodType: string;
  administradora: string;
  priceRange: { min: number; max: number };
  search: string;
}

interface MarketplaceState {
  filters: MarketplaceFilters;
  setStatus: (status: string) => void;
  setGoodType: (goodType: string) => void;
  setAdministradora: (administradora: string) => void;
  setPriceRange: (min: number, max: number) => void;
  setSearch: (search: string) => void;
  clearFilters: () => void;
}

const defaultFilters: MarketplaceFilters = {
  status: "",
  goodType: "",
  administradora: "",
  priceRange: { min: 0, max: 1000000 },
  search: "",
};

const useMarketplaceStore = create<MarketplaceState>((set) => ({
  filters: { ...defaultFilters },
  setStatus: (status) =>
    set((state) => ({ filters: { ...state.filters, status } })),
  setGoodType: (goodType) =>
    set((state) => ({ filters: { ...state.filters, goodType } })),
  setAdministradora: (administradora) =>
    set((state) => ({ filters: { ...state.filters, administradora } })),
  setPriceRange: (min, max) =>
    set((state) => ({
      filters: { ...state.filters, priceRange: { min, max } },
    })),
  setSearch: (search) =>
    set((state) => ({ filters: { ...state.filters, search } })),
  clearFilters: () => set({ filters: { ...defaultFilters } }),
}));

export default useMarketplaceStore;
