import { create } from 'zustand';

export const useBudgetStore = create((set) => ({
  activeTab: 'overview',
  sidebarOpen: false,
  activeYearIndex: 3, // Default is 3 (2026-27 BE)

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  setActiveYearIndex: (index) => set({ activeYearIndex: index })
}));
