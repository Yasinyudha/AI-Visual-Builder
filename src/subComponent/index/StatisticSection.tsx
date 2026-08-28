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

function DisplayGraph() {
    // Pull selected file path state
    const selectedFilePath = useIndexStore((state) => state.selectedFilePath);
    const selectedFeatures = useIndexStore((state) => state.selectedFeatures);

    // Pull histogram data
    const [dataHistogram, setDataHistogram] = useIndex('dataHistogram');

    // Pick the first selected feature, or fallback to a default
    const activeColumn = selectedFeatures[0] || 'study_time_hours';

    useEffect(() => {
        if (!selectedFilePath) return;

        const fetchData = async (filePath: string, column: string) => {
            const response = await fetch(
                'http://localhost:8000/api/create-histogram',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: filePath,
                        column: column,
                        bins: 5,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error('Failed to read columns');
            }

            const data = await response.json();
            setDataHistogram(data.data);
        };

        fetchData(selectedFilePath, 'study_time_hours');
    }, [selectedFilePath, activeColumn]);

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

const Graph = () => {
    return (
        <div className="flex flex-col rounded-xl border border-white/50 bg-white/10 px-7 py-5">
            <div className="flex items-center justify-between">
                <span>Feature Distribution Visualization</span>
                <div className="flex items-center gap-3">
                    <span>Feature Subset</span>
                    <div className="flex items-center gap-3 rounded-md border border-white/50 px-3 py-1">
                        <span>Value Column</span>
                        <img
                            src={arrow}
                            alt="arrow"
                            className="w-3 rotate-90"
                        />
                    </div>
                </div>
            </div>
            <DisplayGraph />
        </div>
    );
};

export const StatisticSection = () => {
    return (
        <div className="grid grid-cols-2 border-t border-white/10 p-8 text-xs">
            <Graph />
        </div>
    );
};
