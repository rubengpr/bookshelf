import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PremiumStore {
  isPremium: boolean;
  setPremium: (premium: boolean) => void;
  checkPremiumStatus: () => boolean;
}

export const usePremiumStatus = create<PremiumStore>()(
  persist(
    (set, get) => ({
      isPremium: false,
      setPremium: (premium: boolean) => set({ isPremium: premium }),
      checkPremiumStatus: () => get().isPremium,
    }),
    {
      name: "premium-status",
    }
  )
);
