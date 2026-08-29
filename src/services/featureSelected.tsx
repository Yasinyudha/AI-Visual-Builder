import { useEffect, useState } from 'react';
import { search } from '../renderer/global';
import { useIndex } from '../stores/renderer/indexStore';

interface FeatureSelectedProps {
    state: boolean;
    columns: string[] | null;
    onClose: () => void;
}

export const FeatureSelected = ({
    state,
    columns,
    onClose,
}: FeatureSelectedProps) => {
    const [selectFeatures, setSelectFeatures] = useIndex('selectedFeatures');

    useEffect(() => {
        if (!state) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
    }, [state, onClose]);

    const handleToggleTag = (columnName: string) => {
        const updatedFeatures = selectFeatures.includes(columnName)
            ? selectFeatures.filter((item) => item !== columnName)
            : [...selectFeatures, columnName];

        setSelectFeatures(updatedFeatures);
    };

    return (
        <>
            {state === true && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs"
                    onClick={onClose}
                >
                    <div
                        className="bg-dark h-[50vh] w-[50vw] rounded-xl border border-white/50 p-8 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex w-[50%] items-center gap-5 rounded-full border border-white/10 px-5 py-3">
                            <img src={search} alt="search" className="w-5" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full outline-none hover:outline-none"
                            />
                        </div>
                        <div className="mt-5 flex max-h-96 flex-wrap gap-5 overflow-y-auto">
                            {columns?.map((column, colIndex) => {
                                const isTagSelected =
                                    selectFeatures.includes(column);

                                return (
                                    <div
                                        key={colIndex}
                                        className={`rounded-md border px-4 py-2 ${
                                            isTagSelected
                                                ? 'bg-bright-red/10 border-bright-red'
                                                : 'border-white/50 bg-white/10'
                                        }`}
                                        onClick={() => handleToggleTag(column)}
                                    >
                                        <span>{column}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
