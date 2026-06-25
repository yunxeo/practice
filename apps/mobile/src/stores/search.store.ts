import { create } from 'zustand';

interface SearchState {
  query: string;
  recentSearches: string[];
  setQuery: (q: string) => void;
  addRecentSearch: (q: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  recentSearches: [],

  setQuery: (q) => set({ query: q }),

  addRecentSearch: (q) =>
    set((state) => ({
      recentSearches: [q, ...state.recentSearches.filter((s) => s !== q)].slice(0, 10),
    })),

  clearRecentSearches: () => set({ recentSearches: [] }),
}));
