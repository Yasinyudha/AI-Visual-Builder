import { useEffect, useState } from "react";
import { Sidebar } from "./SubSidebar";
import { SidebarWithFiles } from "./SubSidebarWithFiles";
import { TableSection } from "./SubTableSection";
import { GrapherSection } from "./SubGrapher";
import { create } from "zustand";

interface HeaderBlockTemplateInterface {
  title: string;
  value: number;
  isChoosed: boolean;
  onChoose: (value: number) => void;
}

export interface FileItem {
  filename: string;
  full_path: string;
  size_bytes: number;
  last_modified?: string;
  url: string;
}

export interface FilesInterface {
  files: FileItem[];
  setFiles: (files: FileItem[]) => void;
}

export const useFiles = create<FilesInterface>((set) => ({
  files: [],
  setFiles: (files) => set({ files: files }),
}));

export const HeaderBlockTemplate = ({
  title,
  value,
  isChoosed,
  onChoose,
}: HeaderBlockTemplateInterface) => {
  return (
    <div
      onClick={() => onChoose(value)}
      className={`h-fit px-5 py-1.5 hover:cursor-pointer ${isChoosed && "bg-grey/60 rounded-sm"}`}
    >
      <span>{title}</span>
    </div>
  );
};

const MainGrapher = () => {
  return (
    <div className="grid min-h-0 flex-1 grid-rows-[2fr_1fr]">
      <GrapherSection />
      <TableSection />
    </div>
  );
};

const Main = () => {
  const [headerIndex, setHeaderIndex] = useState<number>(0);

  return (
    <div className="text-dim-white flex h-full flex-col overflow-hidden">
      <div className="border-grey flex items-center justify-between border-b px-8 py-3">
        <div className="flex gap-1">
          <HeaderBlockTemplate
            title="Grapher"
            value={0}
            isChoosed={headerIndex == 0}
            onChoose={(value) => setHeaderIndex(value)}
          />
          <HeaderBlockTemplate
            title="Statistics"
            value={1}
            isChoosed={headerIndex == 1}
            onChoose={(value) => setHeaderIndex(value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-dim-white h-6 w-6 rounded-full"></div>
          <span>Yasin Yudha Praditha</span>
        </div>
      </div>
      <MainGrapher />
    </div>
  );
};

function MainContent() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const setFiless = useFiles((state) => state.setFiles);

  useEffect(() => {
    const handleFetchFiles = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/fetch-files", {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          setFiles(data.files);
          setFiless(data.files);
        }
      } catch (error) {
        console.error("Terdapat error: ", error);
      }
    };

    handleFetchFiles();
  }, []);

  return (
    <div className="bg-main-background font-jakarta-regular h-screen w-full overflow-hidden text-sm">
      <div className="grid h-full grid-cols-[1fr_5fr]">
        {files.length == 0 ? <Sidebar /> : <SidebarWithFiles files={files} />}
        <Main />
      </div>
    </div>
  );
}

export default MainContent;
