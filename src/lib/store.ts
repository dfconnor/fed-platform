'use client';

import { create } from 'zustand';
import { InsuranceTier, PaymentMethod, SearchFilters } from '@/types';

interface SearchState {
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  isMapView: boolean;
  toggleMapView: () => void;
}

const defaultFilters: SearchFilters = {
  location: '',
  startDate: '',
  endDate: '',
  sortBy: 'rating',
  page: 1,
  limit: 24,
};

export const useSearchStore = create<SearchState>((set) => ({
  filters: defaultFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: newFilters.page ?? 1 },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
  isMapView: true,
  toggleMapView: () => set((state) => ({ isMapView: !state.isMapView })),
}));

interface BookingState {
  listingId: string | null;
  startDate: string;
  endDate: string;
  guests: number;
  insuranceTier: InsuranceTier;
  insuranceProvider: string;
  insurancePrice: number;
  addOns: { name: string; price: number }[];
  paymentMethod: PaymentMethod;
  specialRequests: string;
  deliveryAddress: string;
  setBooking: (data: Partial<BookingState>) => void;
  addAddOn: (addOn: { name: string; price: number }) => void;
  removeAddOn: (name: string) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  listingId: null,
  startDate: '',
  endDate: '',
  guests: 1,
  insuranceTier: 'ESSENTIAL',
  insuranceProvider: '',
  insurancePrice: 0,
  addOns: [],
  paymentMethod: 'CARD',
  specialRequests: '',
  deliveryAddress: '',
  setBooking: (data) => set((state) => ({ ...state, ...data })),
  addAddOn: (addOn) =>
    set((state) => ({
      addOns: [...state.addOns.filter((a) => a.name !== addOn.name), addOn],
    })),
  removeAddOn: (name) =>
    set((state) => ({
      addOns: state.addOns.filter((a) => a.name !== name),
    })),
  reset: () =>
    set({
      listingId: null,
      startDate: '',
      endDate: '',
      guests: 1,
      insuranceTier: 'ESSENTIAL',
      insuranceProvider: '',
      insurancePrice: 0,
      addOns: [],
      paymentMethod: 'CARD',
      specialRequests: '',
      deliveryAddress: '',
    }),
}));

interface UIState {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  searchBarCompact: boolean;
  setSearchBarCompact: (compact: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  searchBarCompact: false,
  setSearchBarCompact: (compact) => set({ searchBarCompact: compact }),
}));
