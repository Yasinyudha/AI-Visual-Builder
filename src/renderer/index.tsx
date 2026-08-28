import { createRoot } from 'react-dom/client';
import { PythonCalculator } from '../services/service';
import { BottomMainContent } from '../services/BottomMainContent';
import { FeatureSelected } from '../services/featureSelected';
import { LabelSelected } from '../services/labelSelected';
import { useIndex, useIndexStore } from '../stores/renderer/indexStore';
import { WorkspaceEditor } from '../subComponent/index/WorkspaceEditor';
import { TableEditor } from '../subComponent/index/TableEditor';
import { useMainContentStore } from '../stores/services/BottomMainContentStore';
import { StatisticSection } from '../subComponent/index/StatisticSection';

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

    // Set selected labels state
    const setSelectedLabels = useIndexStore((state) => state.setSelectedLabels);

    // Set selected features state
    const [selectedFeatures, setSelectedFeatures] =
        useIndex('selectedFeatures');

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
                onSelectFeatures={(features) => {
                    setSelectedFeatures(features);
                }}
                onClose={() => setFeatureModalOpen(false)}
            />

            <LabelSelected
                state={isLabelModalOpen}
                columns={outSectionFeatures}
                onSelectLabels={(labels) => {
                    setSelectedLabels(labels);
                }}
                onClose={() => setLabelModalOpen(false)}
            />
        </div>
    );
};

const MainContent = () => {
    return (
        <div className="grid grid-rows-[2fr_1fr]">
            <div className="grid grid-rows-[1fr_2fr]">
                <div></div>
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
        <div className="font-jakarta-regular bg-dark flex h-screen flex-col text-sm text-white">
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
