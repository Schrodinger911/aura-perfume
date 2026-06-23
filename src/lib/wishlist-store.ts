import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  ids: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
        })),
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: "aeterna-wishlist" },
  ),
);

type RecentState = {
  ids: string[];
  visit: (id: string) => void;
};

export const useRecent = create<RecentState>()(
  persist(
    (set) => ({
      ids: [],
      visit: (id) =>
        set((s) => ({
          ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, 8),
        })),
    }),
    { name: "aeterna-recent" },
  ),
);

type SearchHistoryState = {
  history: string[];
  add: (q: string) => void;
  clear: () => void;
};

export const useSearchHistory = create<SearchHistoryState>()(
  persist(
    (set) => ({
      history: [],
      add: (q) =>
        set((s) => ({
          history: [q, ...s.history.filter((x) => x !== q)].slice(0, 6),
        })),
      clear: () => set({ history: [] }),
    }),
    { name: "aeterna-search-history" },
  ),
);
