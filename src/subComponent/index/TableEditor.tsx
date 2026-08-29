import React, { useState } from 'react';
import { useIndex, useIndexStore } from '../../stores/renderer/indexStore';
import { arrow } from '../../renderer/global';
import { useMainContentStore } from '../../stores/services/BottomMainContentStore';

interface SelectorItemProps {
    title: string;
    count: number | null;
    itemText: string;
    onClick: () => void;
}

interface RadioSelectorProps {
    title: string;
    isSelected: boolean;
    setIsSelected: (newState: boolean) => void;
}

interface NormalizingMethodProps {
    title: string;
    normalizedState: boolean;
    scalerDropdownState: boolean;
    scalerValue: string;
    scalerOptions: string[];
    setScalerDropdownState: (scalerDropdownState: boolean) => void;
    setScalerValue: (scalerValue: string) => void;
}

// All of helper and sub-components are written here
function SelectorItem({ title, count, itemText, onClick }: SelectorItemProps) {
    return (
        <div
            className="flex items-center justify-between px-3 py-2 hover:cursor-pointer hover:rounded-md hover:bg-white/5"
            onClick={onClick}
        >
            <span>{title}</span>
            <span className="font-jakarta-regular text-xs">
                {count !== null ? count : 0} {itemText}
            </span>
        </div>
    );
}

function RadioSelector({
    title,
    isSelected,
    setIsSelected,
}: RadioSelectorProps) {
    return (
        <div className="flex items-center justify-between px-3 py-2">
            <span>{title}</span>
            <div
                className={`border-2 border-white hover:cursor-pointer ${isSelected ? 'p-0.5' : 'p-1.5'}`}
                onClick={() => setIsSelected(!isSelected)}
            >
                {isSelected && <div className="h-1.5 w-1.5 bg-white"></div>}
            </div>
        </div>
    );
}

function DropdownSelector({
    title,
    normalizedState,
    scalerDropdownState,
    scalerValue,
    scalerOptions,
    setScalerDropdownState,
    setScalerValue,
}: NormalizingMethodProps) {
    return (
        <div
            className={`items-center justify-between px-3 py-2 ${normalizedState ? 'flex' : 'hidden'}`}
        >
            <span>{title}</span>
            <div
                className="relative flex items-center justify-between gap-3 rounded-md border border-white/50 px-4 py-2 text-xs"
                onClick={() => setScalerDropdownState(!scalerDropdownState)}
            >
                <span>{scalerValue}</span>
                <img src={arrow} alt="arrow" className="w-3 rotate-90" />
                <div
                    className={`bg-dark absolute top-full left-0 z-50 flex-col gap-1 rounded-md border border-white/50 p-2 text-xs ${
                        scalerDropdownState ? 'flex' : 'hidden'
                    }`}
                >
                    {scalerOptions.map((scaler, index) => (
                        <div
                            key={index}
                            className="rounded-md px-4 py-2 hover:cursor-pointer hover:bg-white/10"
                            onClick={() => setScalerValue(scaler)}
                        >
                            <span className="whitespace-nowrap">{scaler}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ProcessSubmit() {
    // Add loading state
    const [isLoading, setIsLoading] = useState(false);

    // State for processing table payload
    const selectedFilePath = useIndexStore((state) => state.selectedFilePath);
    const selectedFeatures = useIndexStore((state) => state.selectedFeatures);
    const selectedLabels = useIndexStore((state) => state.selectedLabels);
    const dropnaState = useIndexStore((state) => state.dropnaState);

    const normalizedState = useIndexStore((state) => state.normalizedState);
    const scalerValue = useIndexStore((state) => state.scalerValue);

    const encodeCategoricalState = useIndexStore(
        (state) => state.encodeCategoricalState,
    );
    const encodeCategoricalValue = useIndexStore(
        (state) => state.encodeCategoricalValue,
    );
    const limit = useMainContentStore((state) => state.limit);

    const setProcessedRows = useMainContentStore(
        (state) => state.setProcessedRows,
    );
    const setProcessedColumns = useMainContentStore(
        (state) => state.setProcessedColumns,
    );
    const setProcessedDataList = useIndexStore(
        (state) => state.setProcessedDataList,
    );
    const setCorrelationMatrixValue = useIndexStore(
        (state) => state.setCorrelationMatrixValue,
    );

    const handleProcessedTable = async () => {
        if (!selectedFilePath) return;

        setIsLoading(true);

        const response = await fetch(
            'http://localhost:8000/api/read-processed-table',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path: selectedFilePath,
                    selectedFeatures,
                    selectedLabels,
                    isDropna: dropnaState,
                    normalizingMethod: normalizedState ? scalerValue : null,
                    encodingMethod: encodeCategoricalState
                        ? encodeCategoricalValue
                        : null,
                    limit: limit,
                }),
            },
        );

        const responseMatrix = await fetch(
            'http://localhost:8000/api/get-correlation-matrix',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path: selectedFilePath,
                    columns: selectedFeatures,
                }),
            },
        );

        // Await data
        const data = await response.json();
        const dataMatrix = await responseMatrix.json();

        setProcessedRows(data.rows);
        setProcessedColumns(data.columns);

        // Push the new processed data
        setProcessedDataList(data.data);

        // Push the new matrix data
        setCorrelationMatrixValue(dataMatrix.matrix);

        setIsLoading(false);
    };

    return (
        <button
            disabled={isLoading}
            className={`mx-3 mt-3 flex items-center justify-center gap-2 rounded-md border border-white/50 bg-white/10 p-2 transition-all duration-150 ease-in-out ${
                isLoading
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:border-bright-green hover:bg-bright-green/10 hover:cursor-pointer'
            }`}
            onClick={handleProcessedTable}
        >
            {isLoading ? (
                <>
                    {/* Tailwind Animated Spinner */}
                    <svg
                        className="h-4 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <span>Processing...</span>
                </>
            ) : (
                <span>Process and Apply</span>
            )}
        </button>
    );
}

export const TableEditor = () => {
    const [isFeatureModalOpen, setFeatureModalOpen] =
        useIndex('isFeatureModalOpen');
    const [isLabelModalOpen, setLabelModalOpen] = useIndex('isLabelModalOpen');
    const [dropnaState, setDropnaState] = useIndex('dropnaState');
    const [normalizedState, setNormalizedState] = useIndex('normalizedState');
    const [scalerDropdownState, setScalerDropdownState] = useIndex(
        'scalerDropdownState',
    );
    const [scalerValue, setScalerValue] = useIndex('scalerValue');
    const [encodeCategoricalState, setEncodeCategoricalState] = useIndex(
        'encodeCategoricalState',
    );
    const [encodeCategoricalValue, setEncodeCategoricalValue] = useIndex(
        'encodeCategoricalValue',
    );
    const [encodeCategoricalDropdownState, setEncodeCategoricalDropdownState] =
        useIndex('encodeCategoricalDropdownState');

    const [selectedLabels] = useIndex('selectedLabels');
    const [selectedFeatures] = useIndex('selectedFeatures');

    return (
        <div>
            <div className="flex items-center justify-between border-b border-white/10 px-3 pt-1.5 pb-2.5">
                <span>Table Editor</span>
            </div>
            <div className="mt-3 flex flex-col gap-1">
                <SelectorItem
                    title="Feature"
                    count={selectedFeatures.length}
                    itemText="features"
                    onClick={() => setFeatureModalOpen(true)}
                />
                <SelectorItem
                    title="Label"
                    count={selectedLabels.length}
                    itemText="labels"
                    onClick={() => setLabelModalOpen(true)}
                />
                <RadioSelector
                    title="Drop NaN values"
                    isSelected={dropnaState}
                    setIsSelected={setDropnaState}
                />
                <RadioSelector
                    title="Normalize value"
                    isSelected={normalizedState}
                    setIsSelected={setNormalizedState}
                />
                <DropdownSelector
                    title="Normalizing Methods"
                    normalizedState={normalizedState}
                    scalerDropdownState={scalerDropdownState}
                    scalerValue={scalerValue}
                    scalerOptions={['MinMax Scaler', 'Robust Scaler']}
                    setScalerValue={setScalerValue}
                    setScalerDropdownState={setScalerDropdownState}
                />
                <RadioSelector
                    title="Encode categorical"
                    isSelected={encodeCategoricalState}
                    setIsSelected={setEncodeCategoricalState}
                />
                <DropdownSelector
                    title="Encoding Methods"
                    normalizedState={encodeCategoricalState}
                    scalerDropdownState={encodeCategoricalDropdownState}
                    scalerValue={encodeCategoricalValue}
                    scalerOptions={['One-Hot Encoding', 'Ordinal Encoding']}
                    setScalerValue={setEncodeCategoricalValue}
                    setScalerDropdownState={setEncodeCategoricalDropdownState}
                />
                <ProcessSubmit />
            </div>
        </div>
    );
};
