import { createRoot } from 'react-dom/client';
import { BottomMainContent } from '../services/bottomMainContent';
import { FeatureSelected } from '../services/featureSelected';
import { LabelSelected } from '../services/labelSelected';
import { useIndex, useIndexStore } from '../stores/renderer/indexStore';
import { WorkspaceEditor } from '../subComponent/index/WorkspaceEditor';
import { TableEditor } from '../subComponent/index/TableEditor';
import { useMainContentStore } from '../stores/services/BottomMainContentStore';
import { StatisticSection } from '../subComponent/index/StatisticSection';
import { MachineLearningFramework } from '../subComponent/index/MachineLearningFramework';

const Header = () => {
    const padding =
        'rounded-sm py-1 pr-15 pl-6 whitespace-nowrap hover:cursor-pointer hover:bg-slate-300/10';
    const [isFileActive, setIsFileActive] = useIndex('isFileActive');

    return (
        <div className="flex gap-8 border-b border-white/10 px-5 py-2">
            <div
                className="relative"
                onClick={() => setIsFileActive(!isFileActive)}
            >
                <span className="hover:cursor-pointer">File</span>
                {isFileActive && (
                    <div className="bg-dark absolute top-6 left-0 flex flex-col gap-2 rounded-md border border-slate-300/30 px-1 py-2">
                        <span className={padding}>Open dataset</span>
                        <div className="border-t border-slate-300/30"></div>
                        <span className={padding}>Exit</span>
                    </div>
                )}
            </div>
            <span>View</span>
        </div>
    );
};

const Sidebar = ({
    onSelectFile,
}: {
    onSelectFile: (filePath: string) => void;
}) => {
    // Set feature state for popup
    const [isFeatureModalOpen, setFeatureModalOpen] =
        useIndex('isFeatureModalOpen');

    // Set label state for popup
    const [isLabelModalOpen, setLabelModalOpen] = useIndex('isLabelModalOpen');

    // Set selected features state
    const selectedFeatures = useIndexStore((state) => state.selectedFeatures);

    // Pull columns
    const columns = useMainContentStore((state) => state.columns);

    const outSectionFeatures = (columns ?? []).filter(
        (item) => !selectedFeatures.includes(item),
    );

    return (
        <div className="grid grid-rows-[2fr_5fr] border-r border-white/10 px-2 pt-3">
            <WorkspaceEditor
                onSelectFile={(filePath) => onSelectFile(filePath)}
            />
            <TableEditor />

            <FeatureSelected
                state={isFeatureModalOpen}
                columns={columns}
                onClose={() => setFeatureModalOpen(false)}
            />

            <LabelSelected
                state={isLabelModalOpen}
                columns={outSectionFeatures}
                onClose={() => setLabelModalOpen(false)}
            />
        </div>
    );
};

const MainContent = () => {
    const frameworks = ['Machine Learning Framework'];

    // Payload to train linear regression
    const selectedFilePath = useIndexStore((state) => state.selectedFilePath);
    const selectedFeatures = useIndexStore((state) => state.selectedFeatures);
    const selectedLabels = useIndexStore((state) => state.selectedLabels);
    const dropnaState = useIndexStore((state) => state.dropnaState);
    const sliderRatio = useIndexStore((state) => state.sliderRatio);

    // Loading state while train linear regression
    const setIsTraining = useIndexStore((state) => state.setIsTraining);

    // Payload receiver when the training ends
    const setLinearRegressionMetrics = useIndexStore(
        (state) => state.setLinearRegressionMetrics,
    );

    const handleTrain = () => {
        setIsTraining(true);

        const fetchData = async () => {
            const response = await fetch(
                'http://localhost:8000/api/perform-linear-regression',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        filePath: selectedFilePath,
                        selectedFeatures: selectedFeatures,
                        selectedLabels: selectedLabels,
                        isDropna: dropnaState,
                        splitRatio: sliderRatio,
                    }),
                },
            );

            const data = await response.json();
            setLinearRegressionMetrics(data);
            setIsTraining(false);
        };

        fetchData();
    };

    return (
        <div className="grid grid-rows-[2fr_1fr]">
            <div className="grid grid-rows-[1fr_2fr]">
                <div className="flex flex-col gap-5 px-7 py-5">
                    <div className="flex gap-5">
                        <div className="flex gap-5 border-r border-white/50 pr-5">
                            {frameworks.map((framework, index) => (
                                <span key={index}>{framework}</span>
                            ))}
                        </div>
                        <button
                            className="bg-bright-green font-jakarta-semibold text-dark flex items-center justify-center rounded-sm px-4 py-1 text-xs hover:cursor-pointer"
                            onClick={handleTrain}
                        >
                            <span>Train Machine Learning Model</span>
                        </button>
                    </div>
                    <MachineLearningFramework />
                </div>
                <StatisticSection />
            </div>
            <BottomMainContent />
        </div>
    );
};

const App = () => {
    const setSelectedFilePath = useIndexStore(
        (state) => state.setSelectedFilePath,
    );

    return (
        <div className="font-jakarta-regular bg-dark flex h-screen flex-col overflow-y-hidden text-sm text-white">
            <Header />
            <div className="grid flex-1 grid-cols-[1fr_4fr]">
                <Sidebar onSelectFile={(path) => setSelectedFilePath(path)} />
                <MainContent />
            </div>
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
