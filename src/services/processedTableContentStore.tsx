import { create } from 'zustand';

interface TableState {
    // Hold limit state
    limit: number;
    setLimit: (limit: number) => void;

    // Hold the total rows of table
    totalRows: number;
    setTotalRows: (totalRows: number) => void;
}

export const useProcessedTableContentStore = create<TableState>((set) => ({
    limit: 5,
    totalRows: 0,

    setLimit: (newLimit) => set({ limit: newLimit }),
    setTotalRows: (newTotalRows) => set({ totalRows: newTotalRows }),
}));
