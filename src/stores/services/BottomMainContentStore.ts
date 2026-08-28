import { create } from "zustand";

interface TableRow {
    [key: string]: any;
}

interface MainContentStore {
    // Hold limit number
    limit: number;
    setLimit: (limit: number) => void;

    // Hold total rows
    totalRows: number;
    setTotalRows: (totalRows: number) => void;

    // Hold table columns
    columns: string[];
    setColumns: (columns: string[]) => void;

    // Hold table rows
    rows: TableRow[];
    setRows: (rows: TableRow[]) => void;

    // Hold processed columns
    processedColumns: string[];
    setProcessedColumns: (processedColumns: string[]) => void;

    // Hold processed table rows
    processedRows: TableRow[];
    setProcessedRows: (processedRows: TableRow[]) => void;

    // Hold menu table state
    menuTableState: number;
    setMenuTableState: (menuTableState: number) => void;
}

export const useMainContentStore = create<MainContentStore>((set) => ({
    limit: 5,
    setLimit: (newLimit) => set({ limit: newLimit }),

    totalRows: 0,
    setTotalRows: (newTotalRows) => set({ totalRows: newTotalRows }),

    columns: [],
    setColumns: (newColumns) => set({ columns: newColumns }),

    rows: [],
    setRows: (newRows) => set({ rows: newRows }),

    processedColumns: [],
    setProcessedColumns: (newProcessedColumns) => set({ processedColumns: newProcessedColumns }),

    processedRows: [],
    setProcessedRows: (newProcessedRows) => set({ processedRows: newProcessedRows }),

    menuTableState: 0,
    setMenuTableState: (newMenuTableState) => set({ menuTableState: newMenuTableState })
}))

export function useMainContent<K extends keyof MainContentStore & string>(key: K) {
    const setterKey = `set${key.charAt(0).toUpperCase()}${key.slice(1)}` as keyof MainContentStore;

    const value = useMainContentStore((state) => state[key]);
    const setter = useMainContentStore((state) => state[setterKey]) as (val: MainContentStore[K]) => void;

    return [value, setter] as const;
}