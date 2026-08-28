import { useEffect, useState } from 'react';
import { arrow, emptyFolder } from '../renderer/global';
import { useGlobal, useGlobalStore } from '../workspace/globalStore';
import { useIndexStore } from '../stores/renderer/indexStore';
import {
    useMainContent,
    useMainContentStore,
} from '../stores/services/BottomMainContentStore';

const Header = () => {
    const tableHeaderMenu = ['Raw Table Preview', 'Processed Table Preview'];
    const [isDropdownActive, setIsDropdownActive] = useState(false);

    // Set menu table state
    const [menuTableState, setMenuTableState] =
        useMainContent('menuTableState');

    // Set limit state
    const [limit, setLimit] = useMainContent('limit');

    // Pull total rows from global state
    const totalRows = useMainContentStore((state) => state.totalRows);

    const handleSelect = (value: number) => {
        setLimit(value);
        setIsDropdownActive(false);
    };

    const dropdownStyle = 'pl-2 pr-8 py-1 rounded-sm hover:bg-white/10';

    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-1 rounded-md border border-white/10 p-1">
                {tableHeaderMenu.map((menu, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-center px-4 py-1.5 hover:cursor-pointer ${
                            menuTableState === index
                                ? 'rounded-sm bg-white/10'
                                : ''
                        }`}
                        onClick={() => setMenuTableState(index)}
                    >
                        <span>{menu}</span>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <span>Showing</span>
                <div
                    className="relative flex items-center justify-center gap-5 rounded-md border border-white/50 px-4 py-2 hover:cursor-pointer"
                    onClick={() => setIsDropdownActive(!isDropdownActive)}
                >
                    <span>{limit}</span>
                    <img src={arrow} alt="arrow" className="w-3 rotate-90" />
                    {isDropdownActive && (
                        <div className="bg-dark absolute top-11 left-0 flex flex-col gap-1 rounded-md border border-white/50 px-2 py-2">
                            <span
                                className={dropdownStyle}
                                onClick={() => handleSelect(5)}
                            >
                                5
                            </span>
                            <span
                                className={dropdownStyle}
                                onClick={() => handleSelect(10)}
                            >
                                10
                            </span>
                            <span
                                className={dropdownStyle}
                                onClick={() => handleSelect(15)}
                            >
                                15
                            </span>
                            <span
                                className={dropdownStyle}
                                onClick={() => handleSelect(20)}
                            >
                                20
                            </span>
                        </div>
                    )}
                </div>
                <span>of {totalRows} results</span>
            </div>
        </div>
    );
};

const Table = () => {
    // Pull menu state
    const menuTableState = useMainContentStore((state) => state.menuTableState);

    // Set rows state
    const [rawRows, setRawRows] = useMainContent('rows');

    // Set processed rows state
    const [processedRows, setProcessedTableRows] =
        useMainContent('processedRows');

    // Dynamically assign rows and setRows
    const rows = menuTableState === 0 ? rawRows : processedRows;

    // Set columns state
    const [rawColumns, setRawColumns] = useMainContent('columns');

    // Set processed columns state
    const [processedColumns, setProcessedColumns] =
        useMainContent('processedColumns');

    // Dynamically assign columns and setColumns
    const columns = menuTableState === 0 ? rawColumns : processedColumns;
    const setColumns =
        menuTableState === 1 ? setRawColumns : setProcessedColumns;

    // Set total rows state
    const setTotalRows = useMainContentStore((state) => state.setTotalRows);

    // Pull selected file path state
    const selectedFilePath = useIndexStore((state) => state.selectedFilePath);

    // Pull limit state
    const limit = useMainContentStore((state) => state.limit);

    // Pull selected features state
    const selectedFeatures = useIndexStore((state) => state.selectedFeatures);

    // Pull selected labels state
    const selectedLabels = useIndexStore((state) => state.selectedLabels);

    useEffect(() => {
        if (!selectedFilePath) return;

        const fetchColumns = async (filePath: string) => {
            const response = await fetch(
                'http://localhost:8000/api/read-table',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: filePath,
                        limit: limit,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error('Failed to read columns');
            }

            const data = await response.json();

            setRawColumns(data.columns);
            setRawRows(data.rows);
            setTotalRows(data.total_rows);
        };
        fetchColumns(selectedFilePath);
    }, [selectedFilePath, limit]);

    if (!selectedFilePath) {
        return (
            <div className="font-jakarta-regular mt-10 flex flex-col items-center justify-center text-white/20">
                <img src={emptyFolder} alt="empty-folder" className="w-30" />
                <span>There are no table selected</span>
            </div>
        );
    }

    return (
        <div className="mt-5 max-h-50 w-max overflow-auto rounded-t-xl border border-white/10 bg-white/5 whitespace-nowrap">
            <table className="w-full border-collapse text-left text-slate-200">
                {/* Header Row */}
                <thead className="top-0 border-b border-white/10 bg-white/10 font-semibold">
                    <tr>
                        {columns.map((column, index) => {
                            const isSelected =
                                selectedFeatures.includes(column);
                            const isSelectedLabel =
                                selectedLabels.includes(column);

                            return (
                                <th
                                    key={index}
                                    className={`border-r border-white/10 px-8 py-2.5 font-semibold transition-colors last:border-r-0 ${
                                        isSelected
                                            ? 'bg-bright-red/20 text-white'
                                            : isSelectedLabel
                                              ? 'bg-bright-green/20 text-white'
                                              : ''
                                    }`}
                                >
                                    {column}
                                </th>
                            );
                        })}
                    </tr>
                </thead>

                {/* Body Rows */}
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="border-b border-white/5 transition-colors hover:bg-white/5"
                        >
                            {columns.map((column, colIndex) => {
                                const isSelected =
                                    selectedFeatures.includes(column);
                                const isSelectedLabel =
                                    selectedLabels.includes(column);

                                return (
                                    <td
                                        key={colIndex}
                                        className={`border-r border-white/10 px-8 py-2 text-slate-300 transition-colors last:border-r-0 ${
                                            isSelected
                                                ? 'bg-bright-red/10 text-white'
                                                : isSelectedLabel
                                                  ? 'bg-bright-green/10 text-white'
                                                  : ''
                                        }`}
                                    >
                                        {row[column] !== null &&
                                        row[column] !== undefined
                                            ? String(row[column])
                                            : ''}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const BottomMainContent = () => {
    return (
        <div className="flex w-full min-w-0 flex-col overflow-hidden border-t border-white/10 px-8 pt-5 text-xs">
            <Header />
            <div className="w-full overflow-x-auto">
                <Table />
            </div>
        </div>
    );
};
