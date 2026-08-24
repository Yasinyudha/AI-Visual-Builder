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
}

export const useGlobalStore = create<TableState>((set) => ({
    columns: [],
    rows: [],
    totalRows: 0,
    limit: 5,
    selectedFeatures: [],
    selectedLabels: [],
    selectedFilePath: '',

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
}));
