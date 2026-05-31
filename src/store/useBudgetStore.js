import { create } from 'zustand';
import budgetMaster from '../data/budget_master.json';

export const useBudgetStore = create((set) => ({
  activeTab: 'overview',
  sidebarOpen: false,
  activeYearIndex: 3, // Default is 3 (2026-27 BE)
  masterData: budgetMaster,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  setActiveYearIndex: (index) => set({ activeYearIndex: index }),
  setMasterData: (newData) => set({ masterData: newData }),
  updateMasterDataField: (field, value) => set((state) => ({
    masterData: {
      ...state.masterData,
      [field]: value
    }
  }))
}));
