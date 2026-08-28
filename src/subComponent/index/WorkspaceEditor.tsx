import { fileCsv } from '../../renderer/global';
import { useIndex, useIndexStore } from '../../stores/renderer/indexStore';
import { useWorkspace } from '../../workspace/indexSelection';

export const WorkspaceEditor = ({
    onSelectFile,
}: {
    onSelectFile: (filePath: string) => void;
}) => {
    const workspace = useWorkspace(onSelectFile);
    return (
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
                            <img src={fileCsv} alt="file-csv" className="w-4" />
                            <span>
                                {file.length > 20
                                    ? file.slice(0, 20) + '...'
                                    : file}
                            </span>
                        </div>
                        <div className="font-jakarta-regular text-xs text-white/50">
                            <span>
                                {workspace.size && workspace.size[index] / 1000}{' '}
                                kB
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
