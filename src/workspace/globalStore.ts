import { create } from 'zustand';

interface TableRow {
    [key: string]: any;
}

interface TableState {
    // Hold the columns state
    columns: string[];
    setColumns: (columns: string[]) => void;

    // Hold the rows state
    rows: TableRow[];
    setRows: (rows: TableRow[]) => void;

    // Hold the total rows of table
    totalRows: number;
    setTotalRows: (totalRows: number) => void;

    // Hold limit state
    limit: number;
    setLimit: (limit: number) => void;

    // Hold selected features
    selectedFeatures: string[];
    setSelectedFeatures: (selectedFeatures: string[]) => void;

    // Hold selected labels
    selectedLabels: string[];
    setSelectedLabels: (selectedLabels: string[]) => void;

    // Hold selected file path
    selectedFilePath: string;
    setSelectedFilePath: (selectedFilePath: string) => void;

    // Hold dropna state
    dropnaState: boolean;
    setDropnaState: (dropnaState: boolean) => void;

    // Hold normalized state
    normalizedState: boolean;
    setNormalizedState: (normalizedState: boolean) => void;

    // Hold scaler dropdown state
    scalerDropdownState: boolean;
    setScalerDropdownState: (scalerDropdownState: boolean) => void;

    // Hold scaler value dropdown
    scalerValue: string;
    setScalerValue: (scalerValue: string) => void;

    // Hold encode categorical state
    encodeCategoricalState: boolean;
    setEncodeCategoricalState: (encodeCategoricalState: boolean) => void;

    // Hold encode categorical value
    encodeCategoricalValue: string;
    setEncodeCategoricalValue: (encodeCategoricalValue: string) => void;

    // Hold encode categorical dropdown state
    encodeCategoricalDropdownState: boolean;
    setEncodeCategoricalDropdownState: (
        encodeCategoricalDropdownState: boolean,
    ) => void;
}

export const useGlobalStore = create<TableState>((set) => ({
    columns: [],
    rows: [],
    totalRows: 0,
    limit: 5,
    selectedFeatures: [],
    selectedLabels: [],
    selectedFilePath: '',
    dropnaState: false,
    normalizedState: false,
    scalerDropdownState: false,
    scalerValue: 'MinMax Scaler',
    encodeCategoricalState: false,
    encodeCategoricalValue: 'One-Hot Encoding',
    encodeCategoricalDropdownState: false,

    setColumns: (newColumns) => set({ columns: newColumns }),
    setRows: (newRows) => set({ rows: newRows }),
    setTotalRows: (newTotalRows) => set({ totalRows: newTotalRows }),
    setLimit: (newLimit) => set({ limit: newLimit }),
    setSelectedFeatures: (newSelectedFeatures) =>
        set({ selectedFeatures: newSelectedFeatures }),
    setSelectedLabels: (newSelectedLabels) =>
        set({ selectedLabels: newSelectedLabels }),
    setSelectedFilePath: (newSelectedFilePath) =>
        set({ selectedFilePath: newSelectedFilePath }),
    setDropnaState: (newDropnaState) => set({ dropnaState: newDropnaState }),
    setNormalizedState: (newNormalizedState) =>
        set({ normalizedState: newNormalizedState }),
    setScalerDropdownState: (newScalerDropdownState) =>
        set({ scalerDropdownState: newScalerDropdownState }),
    setScalerValue: (newScalerValue) => set({ scalerValue: newScalerValue }),
    setEncodeCategoricalState: (newEncodeCategoricalState) =>
        set({ encodeCategoricalState: newEncodeCategoricalState }),
    setEncodeCategoricalValue: (newEncodeCategoricalValue) =>
        set({ encodeCategoricalValue: newEncodeCategoricalValue }),
    setEncodeCategoricalDropdownState: (newEncodeCategoricalDropdownState) =>
        set({
            encodeCategoricalDropdownState: newEncodeCategoricalDropdownState,
        }),
}));
