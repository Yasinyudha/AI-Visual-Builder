import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { IconCSV, IconSpinner, IconUpload } from "../Store";
import { create } from "zustand";

interface SidebarIsNotSelectedFileInterface {
  handleButtonClick: () => void;
}

interface SidebarIsSelectedFileInterface {
  selectedFile: File | null;
  setSelectedFile: (selectedFile: File) => void;
}

export const useSelectedFile = create<SidebarIsSelectedFileInterface>(
  (set) => ({
    selectedFile: null,
    setSelectedFile: (selectedFile) => set({ selectedFile: selectedFile }),
  }),
);

export const SidebarIsNotSelectedFile = ({
  handleButtonClick,
}: SidebarIsNotSelectedFileInterface) => {
  return (
    <>
      <IconUpload />
      <button
        onClick={handleButtonClick}
        className="bg-unique-yellow rounded-sm px-4 py-1 hover:cursor-pointer"
      >
        <span className="font-jakarta-semibold">Upload File</span>
      </button>
      <span className="text-dim-white/40">Drop your files here</span>
    </>
  );
};

export const SidebarIsSelectedFile = () => {
  const { selectedFile } = useSelectedFile();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!selectedFile) return;

  const handleUploadFile = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsLoading(true);

      const response = await fetch("http://127.0.0.1:8000/api/upload-csv", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoading(false);

        // Refresh halaman ketika setelah upload
        window.location.reload();

        console.log(data.url);
      }
    } catch (error) {
      console.error("Gagal mengunggah file: ", error);
    }
  };

  return (
    <>
      <span className="text-dim-white">Uploaded File</span>
      <div className="text-dim-white flex w-[80%] flex-col gap-1 text-xs">
        <div className="bg-grey relative flex items-center justify-between rounded-sm px-5 py-2">
          <div className="bg-unique-yellow absolute top-0 left-0 h-full w-1.5 rounded-l-sm"></div>
          <div className="flex items-center gap-2">
            <IconCSV />
            {selectedFile.name.length > 10 && selectedFile.name
              ? selectedFile.name.slice(0, 10) + "..."
              : selectedFile.name}
          </div>
          <span>{(selectedFile.size / 1024).toFixed(1)} kB</span>
        </div>
        <button
          onClick={handleUploadFile}
          className="bg-unique-yellow text-grey font-jakarta-bold mt-2 flex items-center justify-center rounded-sm py-2 hover:cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center gap-1">
              <IconSpinner />
              <span>Processing...</span>
            </div>
          ) : (
            <span>Upload</span>
          )}
        </button>
      </div>
    </>
  );
};

export const Sidebar = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const { selectedFile, setSelectedFile } = useSelectedFile();

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

  return (
    <div className="border-grey flex h-screen w-full border-r p-5">
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
        className={`flex h-full w-full flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-white ${isDragging && "bg-dim-white/40"}`}
      >
        {selectedFile ? (
          <SidebarIsSelectedFile />
        ) : (
          <SidebarIsNotSelectedFile handleButtonClick={handleButtonClick} />
        )}
      </div>
    </div>
  );
};
