import { useState } from 'react';
import { arrow, checkMark } from '../../renderer/global';
import { useIndex, useIndexStore } from '../../stores/renderer/indexStore';

interface InputNumberProps {
    title: string;
    number: number;
    setNumber: (number: number) => void;
}

interface DropdownTemplate {
    title: string;
    value: string;
    dropdownValues: string[];
    setValue: (value: string) => void;
}

interface CheckboxTemplate {
    title: string;
    state: boolean;
    setState: (state: boolean) => void;
}

interface ClassificationMetricPercentageProps {
    label: string;
    percentage: number;
}

function InputNumberTemplate({ title, number, setNumber }: InputNumberProps) {
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNumber = Number(e.target.value);
        setNumber(newNumber);
    };

    return (
        <div className="flex">
            <div className="bg-bright-green text-dark font-jakarta-semibold flex items-center justify-center rounded-l-sm px-3 py-1">
                {title}
            </div>
            <div className="border-bright-green flex items-center justify-center rounded-r-sm border px-5 py-1">
                <input
                    type="number"
                    value={number}
                    style={{
                        width: `${Math.max(1, String(number ?? '').length)}ch`,
                    }}
                    onChange={handleOnChange}
                    className="[appearance:textfield] bg-transparent outline-none focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
            </div>
        </div>
    );
}

function DropdownTemplate({
    title,
    value,
    dropdownValues,
    setValue,
}: DropdownTemplate) {
    const [dropdownState, setDropdownState] = useState<boolean>(false);

    return (
        <div className="flex">
            <div className="bg-bright-green text-dark font-jakarta-semibold flex items-center justify-center rounded-l-sm px-3 py-1">
                {title}
            </div>
            <div className="border-bright-green flex items-center justify-center rounded-r-sm border px-5 py-1">
                <div
                    className="relative flex items-center gap-2 hover:cursor-pointer"
                    onClick={() => setDropdownState(!dropdownState)}
                >
                    <span>{value}</span>
                    <img src={arrow} alt="arrow" className="w-2 rotate-90" />
                    {dropdownState && (
                        <div className="bg-dark absolute top-5 left-0 z-50 flex flex-col gap-3 rounded-sm border border-white/50 px-3 py-2">
                            {dropdownValues.map((val, index) => (
                                <span
                                    key={index}
                                    className="whitespace-nowrap hover:cursor-pointer"
                                    onClick={() => {
                                        setValue(val);
                                        setDropdownState(!dropdownState);
                                    }}
                                >
                                    {val}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function CheckboxTemplate({ title, state, setState }: CheckboxTemplate) {
    return (
        <div className="flex">
            <div className="bg-bright-green text-dark font-jakarta-semibold flex items-center justify-center rounded-l-sm px-3 py-1">
                {title}
            </div>
            <div
                className={`flex items-center justify-center rounded-r-sm px-5 py-1 hover:cursor-pointer ${state ? 'bg-white' : 'border-bright-green border bg-transparent'}`}
                onClick={() => setState(!state)}
            >
                <img src={checkMark} alt="check-mark" className="w-3" />
            </div>
        </div>
    );
}

function ClassificationMetricPercentage({
    label,
    percentage,
}: ClassificationMetricPercentageProps) {
    const clampedPercentage = percentage * 100;

    return (
        <div className="flex w-full items-center gap-4 text-sm text-white select-none">
            <span className="w-24 shrink-0 font-medium text-white/90">
                {label}
            </span>
            <div className="relative h-2.5 flex-1 overflow-hidden rounded-full border border-white/40 bg-transparent">
                <div
                    className="bg-bright-green h-full rounded-full transition-all duration-300"
                    style={{ width: `${clampedPercentage}%` }}
                />
            </div>
            <span className="w-12 shrink-0 text-right font-mono text-white/80">
                {clampedPercentage}%
            </span>
        </div>
    );
}

function Metric() {
    const accuracy = useIndexStore((state) => state.accuracy);

    return (
        <div className="flex flex-col gap-2 text-white">
            <span className="text-sm">Performance Metrics</span>
            <div className="rounded-xl border border-white/50 bg-white/10 p-4">
                <div className="bg-dark flex w-full flex-col items-center justify-center gap-5 rounded-sm px-5 py-3">
                    <span className="text-sm">Classification Metrics</span>
                    <div className="flex w-full flex-col gap-2">
                        <ClassificationMetricPercentage
                            label="Accuracy"
                            percentage={accuracy}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function LinearRegressionMetrics() {
    // Load metric payload of linear regression training
    const linearRegressionMetrics = useIndexStore(
        (state) => state.linearRegressionMetrics,
    );

    return (
        <div className="flex flex-col gap-2 text-white">
            <span className="text-sm">Performance Metrics</span>
            <div className="rounded-xl border border-white/50 bg-white/10 p-4">
                <div className="bg-dark flex w-full flex-col gap-5 rounded-sm px-5 py-3">
                    <div className="flex flex-col gap-2">
                        <table className="w-fit border-collapse text-center">
                            <tbody>
                                {Object.entries(
                                    linearRegressionMetrics ?? {},
                                ).map(([rowKey, rowValue]) => (
                                    <tr key={rowKey}>
                                        <th className="p-2 text-left">
                                            {rowKey === 'r2Score'
                                                ? 'R2 Score'
                                                : rowKey === 'mae'
                                                  ? 'Mean Absolute Error'
                                                  : rowKey === 'rmse' &&
                                                    'Root Mean Squared Error'}
                                        </th>
                                        <td className="p-2 text-left">
                                            {rowValue}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricWhileLoading() {
    return (
        <div className="flex flex-col gap-2 text-white">
            <span className="text-sm">Performance Metrics</span>
            <div className="flex flex-1 items-center justify-center gap-5">
                <svg
                    className="text-bright-green h-6 w-6 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-20"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-90"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
                <span className="text-sm">Still in training...</span>
            </div>
        </div>
    );
}

const TrainTestSplitPhase = () => {
    const [sliderRatio, setSliderRatio] = useIndex('sliderRatio');
    const percentageValue = Math.round(sliderRatio * 100);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        setSliderRatio(newValue / 100);
    };

    // Handle random seed input value
    const [randomSeedInput, setRandomSeedInput] = useIndex('randomSeedInput');

    // Handle problem definition
    const problemDefinitionDropdownValues = ['Classification', 'Regression'];
    const [problemDefinitionDropdownValue, setProblemDefinitionDropdownValue] =
        useIndex('problemDefinitionDropdownValue');

    // Handle preserve class ratio
    const [preserveClassRatioState, setPreserveClassRatioState] = useIndex(
        'preserveClassRatioState',
    );

    return (
        <div className="flex flex-col gap-2 text-white">
            <span className="text-sm">
                Train-Test Split Configuration Phase
            </span>

            <div className="mt-4 flex items-center gap-3">
                <span>0</span>
                <div className="relative flex flex-1 items-center py-4">
                    <div
                        className="absolute -top-3 z-10 flex flex-col items-center transition-all duration-75"
                        style={{
                            left: `${percentageValue}%`,
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <div className="relative rounded-md bg-[#22e55b] px-2.5 py-1 text-xs font-bold text-black shadow-lg">
                            {percentageValue}%
                            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#22e55b]" />
                        </div>
                    </div>
                    <div className="h-2 w-full rounded-full border border-white/40 bg-transparent" />
                    <div
                        className="absolute left-0 h-2 rounded-full bg-[#22e55b] transition-all duration-75"
                        style={{ width: `${percentageValue}%` }}
                    />
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={percentageValue}
                        onChange={handleInputChange}
                        className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0 active:cursor-grabbing"
                    />
                    <span className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 translate-y-5 text-sm font-semibold text-white/70">
                        Train-Test Ratio
                    </span>
                </div>
                <span className="text-white/60">100%</span>
            </div>
            <div className="mt-6 flex gap-5">
                <InputNumberTemplate
                    title="Random Seed Input"
                    number={randomSeedInput}
                    setNumber={setRandomSeedInput}
                />
                <DropdownTemplate
                    title="Problem Definition"
                    value={problemDefinitionDropdownValue}
                    dropdownValues={problemDefinitionDropdownValues}
                    setValue={setProblemDefinitionDropdownValue}
                />
            </div>
            <CheckboxTemplate
                title="Preserve Class Ratio"
                state={preserveClassRatioState}
                setState={setPreserveClassRatioState}
            />
        </div>
    );
};

const ModelAndHyperparameterPhase = () => {
    // Handle selected machine learning model
    const machineLearningModels = [
        'Linear Regression',
        'Multi Linear Regression',
    ];
    const [selectedMachineLearningModel, setSelectedMachineLearningModel] =
        useIndex('selectedMachineLearningModel');

    // Handle learning rate value
    const [learningRate, setLearningRate] = useIndex('learningRate');

    // Handle epoch
    const [epoch, setEpoch] = useIndex('epoch');

    return (
        <div className="flex flex-col gap-2 text-white">
            <span className="text-sm">
                Model and Hyperparameter Selection Phase
            </span>
            <div className="mt-5 flex gap-5">
                <DropdownTemplate
                    title="Select Model"
                    value={selectedMachineLearningModel}
                    dropdownValues={machineLearningModels}
                    setValue={setSelectedMachineLearningModel}
                />
            </div>
            <span className="mt-2">Hyperparameter Selection</span>
            <div className="mt-2 flex items-center gap-5">
                <InputNumberTemplate
                    title="Learning Rate"
                    number={learningRate}
                    setNumber={setLearningRate}
                />
                <InputNumberTemplate
                    title="Epoch"
                    number={epoch}
                    setNumber={setEpoch}
                />
            </div>
        </div>
    );
};

const PerformanceMetrics = () => {
    // Loading state while train linear regression
    const isTraining = useIndexStore((state) => state.isTraining);

    return isTraining ? <MetricWhileLoading /> : <LinearRegressionMetrics />;
};

export const MachineLearningFramework = () => {
    return (
        <div className="grid grid-cols-[1.8fr_1.2fr_2fr] gap-10 text-xs">
            <TrainTestSplitPhase />
            <ModelAndHyperparameterPhase />
            <PerformanceMetrics />
        </div>
    );
};
