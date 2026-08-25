import { useState } from 'react';
import { arrow } from '../renderer/global';
import { useProcessedTableContentStore } from './processedTableContentStore';

const Header = () => {
    const [isDropdownActive, setIsDropdownActive] = useState(false);

    // Set limit state
    const limit = useProcessedTableContentStore((state) => state.limit);
    const setLimit = useProcessedTableContentStore((state) => state.setLimit);

    // Pull total rows from global state
    const totalRows = useProcessedTableContentStore((state) => state.totalRows);

    const handleSelect = (value: number) => {
        setLimit(value);
        setIsDropdownActive(false);
    };

    const dropdownStyle = 'pl-2 pr-8 py-1 rounded-sm hover:bg-white/10';

    return (
        <div className="flex items-center justify-between">
            <span>Processed Table Preview</span>
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

export const ProcessedTablePreview = () => {
    return (
        <div className="flex w-full min-w-0 flex-col overflow-hidden border-t border-white/10 px-8 pt-3">
            <Header />
        </div>
    );
};
