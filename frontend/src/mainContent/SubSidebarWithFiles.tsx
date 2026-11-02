import { IconCSV } from "../Store";
import type { FileItem } from "./MainContent";
import { SidebarIsNotSelectedFile, SidebarIsSelectedFile } from "./SubSidebar";
import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type MouseEvent,
} from "react";
import Papa from "papaparse";
import { create } from "zustand";

interface MainContentInterface {
  files: FileItem[];
}

export interface TableData {
  headers: string[];
  rows: Record<string, string>[];
}

interface ContextMenuElementInterface {
  left: number;
  top: number;
  file: FileItem | null;
}

interface ContextMenu {
  visible: boolean;
  x: number;
  y: number;
  fileItem: FileItem | null;
}

interface TableDataStore {
  tableData: TableData | null;
  setTableData: (tableData: TableData) => void;
}

export const useTableData = create<TableDataStore>((set) => ({
  tableData: null,
  setTableData: (data) => set({ tableData: data }),
}));

export interface FilenameInterface {
  filename: string;
  setFilename: (filename: string) => void;
}

export const useFilename = create<FilenameInterface>((set) => ({
  filename: "",
  setFilename: (filename) => set({ filename: filename }),
}));

const Header = () => {
  return (
    <div className="text-dim-white border-grey border-b px-8 py-4.5">
      <span>File Editor</span>
    </div>
  );
};

const ContextMenuElement = ({
  left,
  top,
  file,
}: ContextMenuElementInterface) => {
  const handleClickDelete = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/delete-file", {
        method: "DELETE",
        body: JSON.stringify({
          file_path: file?.filename,
        }),
      });

      if (response.ok) {
        alert("File berhasil dihapus");

        // Refresh page secara keseluruhan
        window.location.reload();
      }
    } catch (error) {
      console.error("Error dengan pesan: ", error);
    }
  };

  return (
    <button
      onClick={handleClickDelete}
      onContextMenu={(e: MouseEvent) => e.preventDefault()}
      className="border-dim-white/10 bg-main-background font-jakarta-regular fixed w-fit rounded-sm border px-4 py-2 text-xs hover:cursor-pointer"
      style={{
        top: top,
        left: left,
      }}
    >
      <span>Delete this file</span>
    </button>
  );
};

const MainContent = ({ files }: MainContentInterface) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSelectedFile, setIsSelectedFile] = useState<number>(0);
  const [registeredFile, setRegisteredFile] = useState<FileItem | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const { tableData, setTableData } = useTableData();
  const { filename, setFilename } = useFilename();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleProcessFile = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleProcessFile(files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleProcessFile(e.target.files);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRightClick = (e: MouseEvent, file: FileItem) => {
    e.preventDefault();

    if (!contextMenu?.visible) {
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        fileItem: file,
      });
    } else {
      setContextMenu({
        visible: false,
        x: e.clientX,
        y: e.clientY,
        fileItem: file,
      });
    }
  };

  const handleSelectedClickFile = async (file: FileItem, index: number) => {
    // Set state selected file dan register files tersebut ke local state
    setIsSelectedFile(index);
    setRegisteredFile(file);
    setFilename(file.filename);

    // Set kondisi untuk mendownload file dan menyimpannya di RAM
    try {
      const urlResponse = await fetch(
        "http://127.0.0.1:8000/api/fetch-presigned-url",
        {
          method: "POST",
          body: JSON.stringify({
            file_path: file.filename,
          }),
        },
      );
      const presignedUrl = await urlResponse.json();

      const response = await fetch(presignedUrl.url);
      const csvText = await response.text();

      if (tableData?.headers.length !== 0) {
        setTableData({
          headers: [],
          rows: [],
        });
      }

      // Parse string dan load ke memory
      Papa.parse<Record<string, string>>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length > 0) {
            const headers = Object.keys(results.data[0]);
            setTableData({
              headers,
              rows: results.data,
            });
          }
        },
      });
    } catch (error) {
      console.error("Error ketika memproses fetch CSV data: ", error);
    }
  };

  return (
    <>
      {contextMenu?.visible && (
        <ContextMenuElement
          top={contextMenu.y}
          left={contextMenu.x}
          file={contextMenu.fileItem}
        />
      )}
      <div className="text-dim-white grid flex-1 grid-rows-[2fr_1fr] py-3 text-xs">
        <div className="border-grey -mb-1 flex flex-col gap-2 border-b px-4">
          {files.map((file, index) => (
            <div
              key={index}
              onClick={() => handleSelectedClickFile(file, index)}
              onContextMenu={(e) => handleRightClick(e, file)}
              className={`flex w-full items-center justify-between rounded-md px-4 py-2.5 hover:cursor-pointer ${isSelectedFile === index && "bg-dim-white/10"}`}
            >
              <div className="flex items-center gap-2">
                <IconCSV />
                <span>
                  {file.filename.length > 20
                    ? file.filename.slice(0, 20) + "..."
                    : file.filename}
                </span>
              </div>
              <span>{(file.size_bytes / 1024).toFixed(1)} kB</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center p-5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            className="hidden"
          />
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-dim-white text-grey flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed ${isDragging && "bg-dim-white/40"}`}
          >
            {selectedFile ? (
              <SidebarIsSelectedFile />
            ) : (
              <SidebarIsNotSelectedFile handleButtonClick={handleButtonClick} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const SidebarWithFiles = ({ files }: MainContentInterface) => {
  return (
    <div className="border-grey text-dim-white font-jakarta-regular flex h-screen w-full flex-col border-r text-sm">
      <Header />
      <MainContent files={files} />
    </div>
  );
};
