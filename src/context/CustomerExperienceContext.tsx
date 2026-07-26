"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

interface CustomerExperienceContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;

  compareList: string[];
  toggleCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
}

const CustomerExperienceContext = createContext<CustomerExperienceContextType | undefined>(undefined);

export function CustomerExperienceProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    try {
      const storedWishlist = localStorage.getItem("pf_wishlist");
        // intentionally correct: hydration requires state update post-mount
         
        // intentionally correct: hydration requires state update post-mount
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

        const storedRecentlyViewed = localStorage.getItem("pf_recentlyViewed");
         
         
        if (storedRecentlyViewed) setRecentlyViewed(JSON.parse(storedRecentlyViewed));

        const storedCompareList = localStorage.getItem("pf_compareList");
         
         
        if (storedCompareList) setCompareList(JSON.parse(storedCompareList));
    } catch (e) {
      console.error("Failed to parse local storage lists", e);
    }
    // Intentionally hydrate on mount
     
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("pf_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("pf_recentlyViewed", JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("pf_compareList", JSON.stringify(compareList));
    }
  }, [compareList, isMounted]);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const addRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });
  }, []);

  const toggleCompare = useCallback((productId: string) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        if (prev.length >= 3) {
          alert("You can only compare up to 3 products at a time.");
          return prev;
        }
        return [...prev, productId];
      }
    });
  }, []);

  const isInCompare = useCallback((productId: string) => compareList.includes(productId), [compareList]);

  const contextValue = useMemo(() => ({
    wishlist,
    toggleWishlist,
    isInWishlist,
    recentlyViewed,
    addRecentlyViewed,
    compareList,
    toggleCompare,
    isInCompare,
  }), [wishlist, toggleWishlist, isInWishlist, recentlyViewed, addRecentlyViewed, compareList, toggleCompare, isInCompare]);

  return (
    <CustomerExperienceContext.Provider value={contextValue}>
      {children}
    </CustomerExperienceContext.Provider>
  );
}

export function useCustomerExperience() {
  const context = useContext(CustomerExperienceContext);
  if (context === undefined) {
    throw new Error("useCustomerExperience must be used within a CustomerExperienceProvider");
  }
  return context;
}
