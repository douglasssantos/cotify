import { create } from "zustand";

interface ToggleState {
  isListingActive: boolean;
  isDashboardSidebarActive: boolean;
  listingToggleHandler: () => void;
  dashboardSidebarToggleHandler: () => void;
}

const useToggleStore = create<ToggleState>((set) => ({
  isListingActive: false,
  isDashboardSidebarActive: false,
  listingToggleHandler: () =>
    set((state) => ({ isListingActive: !state.isListingActive })),
  dashboardSidebarToggleHandler: () =>
    set((state) => ({
      isDashboardSidebarActive: !state.isDashboardSidebarActive,
    })),
}));

export default useToggleStore;
