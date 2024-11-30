import { create } from 'zustand';

interface FilterState {
  fromDateTime: string;
  toDateTime: string;
  exactDateTime: string;
  isExactSearch: boolean;
  setFilters: (filters: Partial<Omit<FilterState, 'setFilters' | 'resetFilters'>>) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  fromDateTime: '',
  toDateTime: '',
  exactDateTime: '',
  isExactSearch: false,
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
  resetFilters: () => set({
    fromDateTime: '',
    toDateTime: '',
    exactDateTime: '',
    isExactSearch: false
  })
}));