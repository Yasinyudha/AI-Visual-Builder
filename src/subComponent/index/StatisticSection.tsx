import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { arrow } from '../../renderer/global';
import { useEffect } from 'react';
import { useIndex, useIndexStore } from '../../stores/renderer/indexStore';

interface GraphDropdownTemplateProps {
    title: string;
    selectedFeatures: string[];
    featureInHistogramDropdown: boolean;
    dropdownHistogramValue: string;
    setFeatureInHistogramDropdown: (featureHistogramDropdown: boolean) => void;
    setDropdownHistogramValue: (dropdownHistogramValue: string) => void;
}

function DisplayGraph() {
    // Pull necessary data
    const processedDataList = useIndexStore((state) => state.processedDataList);
    const binsValue = useIndexStore((state) => state.binsValue);
    const dropdownHistogramValue = useIndexStore(
        (state) => state.dropdownHistogramValue,
    );

    // Pull histogram data
    const [dataHistogram, setDataHistogram] = useIndex('dataHistogram');

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                'http://localhost:8000/api/create-histogram',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        data: processedDataList,
                        column: dropdownHistogramValue,
                        bins: binsValue,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error('Failed to read columns');
            }

            const data = await response.json();
            setDataHistogram(data.data);
        };

        fetchData();
    }, [dropdownHistogramValue, binsValue, processedDataList]);

    return (
        <div className="bg-dark mt-4 min-h-0 w-full flex-1 rounded-xl p-2">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={dataHistogram}
                    barCategoryGap={2}
                    margin={{ top: 10, right: 20, left: -15, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />

                    <XAxis dataKey="interval" stroke="#aaa" fontSize={11} />
                    <YAxis stroke="#aaa" allowDecimals={false} />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1f2937',
                            borderColor: '#374151',
                            color: '#fff',
                        }}
                    />

                    <Bar dataKey="count" fill="#10b981" radius={[2, 2, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function GraphDropdownTemplate({
    title,
    selectedFeatures,
    featureInHistogramDropdown,
    dropdownHistogramValue,
    setFeatureInHistogramDropdown,
    setDropdownHistogramValue,
}: GraphDropdownTemplateProps) {
    return (
        <div className="flex items-center gap-3">
            <span>{title}</span>
            <div className="relative rounded-md border border-white/50">
                <div
                    className="flex items-center gap-3 px-3 py-1 hover:cursor-pointer"
                    onClick={() =>
                        setFeatureInHistogramDropdown(
                            !featureInHistogramDropdown,
                        )
                    }
                >
                    <span>{dropdownHistogramValue}</span>
                    <img src={arrow} alt="arrow" className="w-3 rotate-90" />
                </div>
                <div
                    className={`bg-dark absolute top-full left-0 z-50 gap-2 rounded-md border border-white/50 px-3 py-2 ${
                        featureInHistogramDropdown &&
                        selectedFeatures.length !== 0
                            ? 'flex flex-col'
                            : 'hidden'
                    }`}
                >
                    {selectedFeatures.map((feature, index) => (
                        <span
                            key={index}
                            className="hover:cursor-pointer"
                            onClick={() => {
                                setDropdownHistogramValue(feature);
                                setFeatureInHistogramDropdown(
                                    !featureInHistogramDropdown,
                                );
                            }}
                        >
                            {feature}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

const Graph = () => {
    // Set the necessary feature subset value and state
    const selectedFeatures = useIndexStore((state) => state.selectedFeatures);
    const [featureInHistogramDropdown, setFeatureInHistogramDropdown] =
        useIndex('featureInHistogramDropdown');
    const [dropdownHistogramValue, setDropdownHistogramValue] = useIndex(
        'dropdownHistogramValue',
    );

    // Set the necessary bins value and state
    const bins = ['5', '15', '25', '30'];
    const [histogramDropdownBinsState, setHistogramDropdownBinsState] =
        useIndex('histogramDropdownBinsState');
    const [binsValue, setBinsValue] = useIndex('binsValue');

    return (
        <div className="flex flex-col rounded-xl border border-white/50 bg-white/10 px-7 py-5">
            <div className="flex items-center justify-between">
                <span>Feature Distribution Visualization</span>
                <div className="flex items-center gap-5">
                    <GraphDropdownTemplate
                        title="Feature Subset"
                        selectedFeatures={selectedFeatures}
                        featureInHistogramDropdown={featureInHistogramDropdown}
                        dropdownHistogramValue={dropdownHistogramValue}
                        setFeatureInHistogramDropdown={(
                            featureInHistogramDropdown,
                        ) =>
                            setFeatureInHistogramDropdown(
                                featureInHistogramDropdown,
                            )
                        }
                        setDropdownHistogramValue={(dropdownHistogramValue) =>
                            setDropdownHistogramValue(dropdownHistogramValue)
                        }
                    />

                    <GraphDropdownTemplate
                        title="Bins"
                        selectedFeatures={bins}
                        featureInHistogramDropdown={histogramDropdownBinsState}
                        dropdownHistogramValue={binsValue}
                        setFeatureInHistogramDropdown={(
                            histogramDropdownBinsState,
                        ) =>
                            setHistogramDropdownBinsState(
                                histogramDropdownBinsState,
                            )
                        }
                        setDropdownHistogramValue={(binsValue) =>
                            setBinsValue(binsValue)
                        }
                    />
                </div>
            </div>
            <DisplayGraph />
        </div>
    );
};

const Matrix = () => {
    const correlationMatrixValue = useIndexStore(
        (state) => state.correlationMatrixValue,
    );
    const correlationKeys = correlationMatrixValue
        ? Object.keys(correlationMatrixValue)
        : [];

    return (
        <div className="flex flex-col rounded-xl border border-white/50 bg-white/10 px-7 py-5">
            <div className="flex items-center justify-between">
                <span>Pearson Correlation Matrix</span>
            </div>
            <div className="bg-dark mt-4 flex min-h-0 w-full flex-1 rounded-xl p-2">
                <div className="overflow-auto px-4 py-2">
                    <table className="border-collapse text-center">
                        <thead>
                            <tr>
                                <th className="p-2 text-left">Feature</th>
                                {correlationKeys.map((key, index) => {
                                    const isTheEnd =
                                        correlationKeys.length === index + 1;
                                    return !isTheEnd ? (
                                        <th key={index} className="p-2">
                                            {key}
                                        </th>
                                    ) : (
                                        <th key={index} className="p-2">
                                            {key}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {correlationKeys.map((rowKey, rowIndex) => (
                                <tr key={rowIndex}>
                                    <th className="p-2 text-left">{rowKey}</th>
                                    {correlationKeys.map((colKey, colIndex) => {
                                        const score =
                                            correlationMatrixValue?.[rowKey]?.[
                                                colKey
                                            ];

                                        return (
                                            <td key={`${rowIndex}-${colIndex}`}>
                                                {score !== null &&
                                                score !== undefined
                                                    ? score.toFixed(3)
                                                    : 'N/A'}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const StatisticSection = () => {
    return (
        <div className="grid grid-cols-2 gap-5 border-t border-white/10 p-8 text-xs">
            <Graph />
            <Matrix />
        </div>
    );
};
