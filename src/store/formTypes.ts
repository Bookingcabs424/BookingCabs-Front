import {create} from 'zustand';

type FeatureStore = {
    selectedFeature: string,
    setSelectedFeature: (feature:string) => void;
}


export const useFeatureStore = create<FeatureStore>((set) => ({
  selectedFeature: 'Rental',
  setSelectedFeature: (feature) => set({ selectedFeature: feature }),
}));