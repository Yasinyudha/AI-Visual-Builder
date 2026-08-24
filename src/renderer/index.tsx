import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { arrow, fetchData, fileCsv } from './global';
import { PythonCalculator } from '../services/service';
import { BottomMainContent } from '../services/bottomMainContent';
import { ipcRenderer } from 'electron';
import { FeatureSelected } from '../services/featureSelected';
import { LabelSelected } from '../services/labelSelected';
import { useWorkspace } from '../workspace/indexSelection';
import { useGlobalStore } from '../workspace/globalStore';

// All of local interfaces is written here
interface SelectorItemProps {
    title: string;
    count: number | null;
    itemText: string;
    onClick: () => void;
}

// All of helper and sub-components written here
function SelectorItem({ title, count, itemText, onClick }: SelectorItemProps) {
    return (
        <div
            className="flex items-center justify-between px-3 py-2 hover:cursor-pointer hover:rounded-md hover:bg-white/5"
            onClick={onClick}
        >
            <span>{title}</span>
            <span className="font-jakarta-regular text-bright-red text-xs">
                {count !== null ? count : 0} {itemText}
            </span>
        </div>
    );
}

const Header = () => {
    const padding =
        'rounded-sm py-1 pr-15 pl-6 whitespace-nowrap hover:cursor-pointer hover:bg-slate-300/10';
    const [isFileActive, setIsFileActive] = useState(false);

    return (
        <div className="flex gap-8 border-b border-white/10 px-5 py-2">
            <div
                className="relative"
                onClick={() => setIsFileActive(!isFileActive)}
            >
                <span className="hover:cursor-pointer">File</span>
                {isFileActive && (
                    <div className="absolute top-6 left-0 flex flex-col gap-2 rounded-md border border-slate-300/30 px-1 py-2">
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
    const workspace = useWorkspace(onSelectFile);

    const [isFeatureModalOpen, setFeatureModalOpen] = useState(false);
    const [isLabelModalOpen, setLabelModalOpen] = useState(false);

    // Set selected file path state
    const selectedFilePath = useGlobalStore((state) => state.selectedFilePath);

    // Set selected labels state
    const selectedLabels = useGlobalStore((state) => state.selectedLabels);
    const setSelectedLabels = useGlobalStore(
        (state) => state.setSelectedLabels,
    );

    // Set selected features state
    const selectedFeatures = useGlobalStore((state) => state.selectedFeatures);
    const setSelectedFeatures = useGlobalStore(
        (state) => state.setSelectedFeatures,
    );

    // Pull columns from global store
    const columns = useGlobalStore((state) => state.columns);

    const outSectionFeatures = (columns ?? []).filter(
        (item) => !selectedFeatures.includes(item),
    );

    return (
        <div className="grid grid-rows-2 border-r border-white/10 px-2 pt-3">
            <div>
                <div
                    className="flex items-center justify-between border-b border-white/10 px-3 pt-1.5 pb-2.5 hover:cursor-pointer hover:rounded-md hover:bg-white/10"
                    onClick={workspace.handleSelectWorkspace}
                    title={
                        workspace.folderName !== 'No Workspace'
                            ? 'Click to select workspace'
                            : undefined
                    }
                >
                    <span>
                        {workspace.folderName !== 'No Workspace'
                            ? `/${workspace.folderName}`
                            : workspace.folderName}
                    </span>
                </div>
                <div className="mt-3 flex flex-col gap-1">
                    {workspace.listFiles.map((file, index) => (
                        <div
                            key={index}
                            className={`flex items-center justify-between gap-2 px-3 py-2 hover:cursor-pointer hover:rounded-md hover:bg-white/5 ${
                                workspace.activeFile === file
                                    ? 'font-jakarta-medium bg-white/15'
                                    : ''
                            }`}
                            onClick={() => workspace.handleFileClick(file)}
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={fileCsv}
                                    alt="file-csv"
                                    className="w-4"
                                />
                                <span>{file}</span>
                            </div>
                            <div className="font-jakarta-regular text-xs text-white/50">
                                <span>
                                    {workspace.size &&
                                        workspace.size[index] / 1000}{' '}
                                    kB
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between border-b border-white/10 px-3 pt-1.5 pb-2.5">
                    <span>Table Editor</span>
                </div>
                <div className="mt-3 flex flex-col gap-1">
                    <SelectorItem
                        title="Feature"
                        count={selectedFeatures.length} // Derived state!
                        itemText="features"
                        onClick={() => setFeatureModalOpen(true)}
                    />
                    <SelectorItem
                        title="Label"
                        count={selectedLabels.length} // Derived state!
                        itemText="labels"
                        onClick={() => setLabelModalOpen(true)}
                    />
                </div>
            </div>

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
        <div className="grid grid-rows-[3fr_1fr]">
            <div className="p-6">
                <PythonCalculator />
            </div>
            <BottomMainContent />
        </div>
    );
};

const App = () => {
    const setSelectedFilePath = useGlobalStore(
        (state) => state.setSelectedFilePath,
    );

    return (
        <div className="font-jakarta-regular bg-dark flex h-screen flex-col text-sm text-white">
            <Header />
            <div className="grid flex-1 grid-cols-[1fr_5fr]">
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
