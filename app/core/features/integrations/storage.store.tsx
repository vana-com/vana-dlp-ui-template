import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StorageProvider } from "./storage.service";

export const ProviderLabel: Record<StorageProvider, string> = {
  "google-drive": "Google Drive",
  dropbox: "Dropbox",
};

type StorageState = {
  provider: StorageProvider | null;
  setProvider: (provider: StorageProvider) => void;

  token: string | null;
  setToken: (token: string) => void;

  expiresAt: number | null;
  setExpiresAt: (expiresAt: number) => void;

  reset: () => void;
};

export const useStorageStore = create<StorageState>()(
  persist(
    (set) => ({
      provider: null,
      setProvider: (provider) => set({ provider }),

      token: null,
      setToken: (token) => set({ token }),

      expiresAt: null,
      setExpiresAt: (expiresAt) => set({ expiresAt }),

      // Clear all state
      reset: () =>
        set({
          provider: null,
          token: null,
          expiresAt: null,
        }),
    }),
    {
      name: "storage-storage",
      onRehydrateStorage: () => {
        return (state) => {
          if (!state) return;

          if (!state.expiresAt || state.expiresAt < Date.now()) {
            state.reset();
          }
        };
      },
    }
  )
);
