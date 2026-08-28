import { create } from "zustand";

interface HistogramItem {
    interval: string;
    count: number;
}

interface IndexStore {
    // Hold header file state
    isFileActive: boolean;
    setIsFileActive: (isFileActive: boolean) => void;

    // Hold the popup handler of feature state
    isFeatureModalOpen: boolean;
    setIsFeatureModalOpen: (isFeatureModalOpen: boolean) => void;

    // Hold the popup handler of label state
    isLabelModalOpen: boolean;
    setIsLabelModalOpen: (isLabelModalOpen: boolean) => void;

    // Hold scaler dropdown state
    scalerDropdownState: boolean;
    setScalerDropdownState: (scalerDropdownState: boolean) => void;

    // Hold scaler value
    scalerValue: string;
    setScalerValue: (scalerValue: string) => void;

    // Hold dropna state
    dropnaState: boolean;
    setDropnaState: (dropnaState: boolean) => void;

    // Hold scaler state
    normalizedState: boolean;
    setNormalizedState: (normalizedState: boolean) => void;

    // Hold the encode categorical state
    encodeCategoricalState: boolean;
    setEncodeCategoricalState: (encodeCategoricalState: boolean) => void;

    // Hold the encode categorical value
    encodeCategoricalValue: string;
    setEncodeCategoricalValue: (encodeCategoricalValue: string) => void;

    // Hold the encode categorical dropdown state
    encodeCategoricalDropdownState: boolean;
    setEncodeCategoricalDropdownState: (encodeCategoricalDropdownState: boolean) => void;

    // Hold selected labels
    selectedLabels: string[];
    setSelectedLabels: (selectedLabels: string[]) => void;

    // Hold selected features
    selectedFeatures: string[];
    setSelectedFeatures: (selectedFeatures: string[]) => void;

    // Selected file path
    selectedFilePath: string | null;
    setSelectedFilePath: (selectedFilePath: string | null) => void;

    // Hold data displayed in histogram
    dataHistogram: HistogramItem[];
    setDataHistogram: (dataHistogram: HistogramItem[]) => void;
}

export const useIndexStore = create<IndexStore>((set) => ({
    isFileActive: false,
    setIsFileActive: (newIsFileActive) => set({ isFileActive: newIsFileActive }),

    isFeatureModalOpen: false,
    setIsFeatureModalOpen: (newIsFeatureModalOpen) => set({ isFeatureModalOpen: newIsFeatureModalOpen }),

    isLabelModalOpen: false,
    setIsLabelModalOpen: (newIsLabelModalOpen) => set({ isLabelModalOpen: newIsLabelModalOpen }),

    scalerDropdownState: false,
    setScalerDropdownState: (newScalerDropdownState) => set({ scalerDropdownState: newScalerDropdownState }),

    scalerValue: 'MinMax Scaler',
    setScalerValue: (newScalerValue) => set({ scalerValue: newScalerValue }),

    dropnaState: false,
    setDropnaState: (newDropnaState) => set({ dropnaState: newDropnaState }),

    normalizedState: false,
    setNormalizedState: (newNormalizedState) => set({ normalizedState: newNormalizedState }),

    encodeCategoricalState: false,
    setEncodeCategoricalState: (newEncodeCategoricalState) => set({ encodeCategoricalState: newEncodeCategoricalState }),

    encodeCategoricalValue: 'One-Hot Encoding',
    setEncodeCategoricalValue: (newEncodeCategoricalValue) => set({ encodeCategoricalValue: newEncodeCategoricalValue }),

    encodeCategoricalDropdownState: false,
    setEncodeCategoricalDropdownState: (newEncodeCategoricalDropdownState) => set({ encodeCategoricalDropdownState: newEncodeCategoricalDropdownState }),

    selectedLabels: [],
    setSelectedLabels: (newSelectedLabels) => set({ selectedLabels: newSelectedLabels }),

    selectedFeatures: [],
    setSelectedFeatures: (newSelectedFeatures) => set({ selectedFeatures: newSelectedFeatures }),

    selectedFilePath: null,
    setSelectedFilePath: (newSelectedFilePath) => set({ selectedFilePath: newSelectedFilePath }),

    dataHistogram: [],
    setDataHistogram: (newDataHistogram) => set({ dataHistogram: newDataHistogram }),
}))

export function useIndex<K extends keyof IndexStore & string>(key: K) {
    const setterKey = `set${key.charAt(0).toUpperCase()}${key.slice(1)}` as keyof IndexStore;

    const value = useIndexStore((state) => state[key]);
    const setter = useIndexStore((state) => state[setterKey]) as (val: IndexStore[K]) => void;

    return [value, setter] as const;
}