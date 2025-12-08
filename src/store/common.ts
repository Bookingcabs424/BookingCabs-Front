import { create } from 'zustand'
import { persist } from 'zustand/middleware'
type GenericData = Record<string, unknown>
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";

type CityStore = {
    cityData: { [key: string]: any } | null
    setCityData: (data: { [key: string]: any }) => void
}
type CountryStore = {
    countryData: { [key: string]: any } | null
    setCountryData: (data: { [key: string]: any }) => void
}

type TokenStore = {
    token: GenericData | null
    setToken: (data: GenericData) => void
}
type BookingSearchStore = {
    form: any | null
    setFormData: (data: GenericData) => void
}
type ActiveModuleStore ={
  activeModules: any[]; // Replace `any` with a more specific type if known
  setActiveModules: (data: any[]) => void;
}


type UserRoleStore = {
  userRoleData: any[] | null;
  setUserRoleData: (data: any[]) => void;
};

export const useCity = create<CityStore>((set) => ({
    cityData: null,
    setCityData: (data) => set({ cityData: data })
}))
export const activeCity = create<CityStore>((set)=>({
    cityData: null,
    setCityData: (data) => set({ cityData: data })

}))

export const useCountry = create<CountryStore>((set) => ({
    countryData: null,
    setCountryData: (data) => set({ countryData: data }),
  
}));

export const useTokenStore = create<TokenStore>((set) => ({
    token: null,
    setToken: (data) => set({ token: data }),
}))

export const useActiveModuleStore = create<ActiveModuleStore>((set)=>({
      activeModules:[],
    setActiveModules:(data)=> set({activeModules:data})
}))
export const useBookingSearchForm = create<BookingSearchStore>()(
  persist(
    (set) => ({
      form: null,
      setFormData: (data) => set({ form: data }),
    }),
    {
      name: 'booking-search-form', // 🔑 required option
    }
  )
);
export const uselatLong = create<any>((set) => ({
    pickup:'',
    drop:'',
    setPickup: (data:string) => set({ pickup: data }),
    setDrop: (data:string) => set({ drop: data }),
    
}))

export const useDistanceStorage = create<any>((set) => ({
    distance: null,
    setDistance: (data:any) => set({ distance: data }),
}))
export const useSelectedVehicle = create<any>()(
  persist(
    (set) => ({
      booking: null,
      setBooking: (data: any) => set({ booking: data }),
    }),
    {
      name: 'selected-booking', // 🔑 required option
    }
  )
);

export const useQuotation = create<any>()(
  persist(
    (set) => ({
      quotationData: null,
      setQuotation: (data: any) => set({ quotationData: data }),
    }),
    {
      name: 'quotation-booking', // 🔑 required option
    }
  )
);

export const useUserRole = create<UserRoleStore>((set) => ({
  userRoleData: null,
  setUserRoleData: (data) => set({ userRoleData: data }),
}));






