import { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

export const useWorkspace = (onSelectFile: (filePath: string) => void) => {
    const [workspacePath, setWorkspacePath] = useState<string | null>(null);
    const [listFiles, setListFiles] = useState<string[]>([]);
    const [size, setSize] = useState<number[] | null>(null);
    const [activeFile, setActiveFile] = useState<string | null>(null);

    const folderName = workspacePath
        ? workspacePath.split('/').pop() || workspacePath
        : 'No Workspace';

    const handleSelectWorkspace = async () => {
        const selectedPath = await ipcRenderer.invoke('select-workspace');
        if (selectedPath) setWorkspacePath(selectedPath);
    };

    const handleFileClick = (filename: string) => {
        if (!workspacePath) return;
        const absolutePath = `${workspacePath}/${filename}`;
        setActiveFile(filename);
        onSelectFile(absolutePath);
    };

    useEffect(() => {
        if (!workspacePath) return;
        const loadDirectory = async () => {
            const response = await fetch(
                'http://localhost:8000/api/read-in-directory',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ path: workspacePath }),
                },
            );
            const data = await response.json();
            setListFiles(data.files || []);
            setSize(data.size || null);
        };
        loadDirectory();
    }, [workspacePath]);

    return {
        folderName,
        listFiles,
        size,
        activeFile,
        handleSelectWorkspace,
        handleFileClick,
    };
};
