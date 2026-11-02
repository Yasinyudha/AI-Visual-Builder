import { useState, type ChangeEvent } from "react";
import { type NodeData, type NodeState } from "./NodePrimary";
import {
  IconDropdownElement,
  IconSliderPointer,
  IconTableSmall,
} from "../../Store";
import { create } from "zustand";
import { useFiles } from "../MainContent";
import { useNodeConnectionState } from "./NodeConnection";
import { cutStringToDesiredLength } from "../../Global";
import { useColumnColor } from "../SubTableSection";

const NODE_WIDTH = 288;
const PORT_OFFSET_Y = 30;

interface InputNodeProps {
  node: NodeData;
}

interface FilenameState {
  filename: string;
  setFilename: (filename: string) => void;
}

interface NormalizationState {
  selectedNormDropdown: string;
  setSelectedNormDropdown: (selectedNormDropdown: string) => void;
}

interface NormalizedFeatureState {
  selectedNormalizedFeatures: string[];
  setSelectedNormalizedFeatures: (featureName: string) => void;
}

interface TrainPortionState {
  trainValue: number;
  setTrainValue: (trainValue: number) => void;
}

const useTrainPortion = create<TrainPortionState>((set) => ({
  trainValue: 80,
  setTrainValue: (trainValue) => set({ trainValue: trainValue }),
}));

export const useSelectedNormalizedFeatures = create<NormalizedFeatureState>(
  (set) => ({
    selectedNormalizedFeatures: [],
    setSelectedNormalizedFeatures: (featureName) =>
      set((state) => {
        const exists = state.selectedNormalizedFeatures.includes(featureName);
        return {
          selectedNormalizedFeatures: exists
            ? state.selectedNormalizedFeatures.filter(
                (item) => item !== featureName,
              )
            : [...state.selectedNormalizedFeatures, featureName],
        };
      }),
  }),
);

export const useNormalizationState = create<NormalizationState>((set) => ({
  selectedNormDropdown: "Not Selected",
  setSelectedNormDropdown: (selectedNormDropdown) =>
    set({ selectedNormDropdown: selectedNormDropdown }),
}));

export const useFilenameState = create<FilenameState>((set) => ({
  filename: "Untitled Dataset",
  setFilename: (filename) => set({ filename: filename }),
}));

const DropdownTitle = () => {
  const files = useFiles((state) => state.files);
  const setFilename = useFilenameState((state) => state.setFilename);

  const handleClickDropdown = (filename: string) => {
    setFilename(filename);
  };

  return (
    <div className="border-dim-white/40 bg-main-background absolute top-full left-0 z-50 mt-1 flex w-full flex-col gap-1 rounded-md border-2 px-2 py-2 text-xs">
      {files.map((file, index) => (
        <div
          key={index}
          onClick={() => handleClickDropdown(file.filename)}
          className="hover:bg-dim-white/10 flex w-full items-center rounded-md px-2 py-1"
        >
          <span>{file.filename}</span>
        </div>
      ))}
    </div>
  );
};

export const useInputNodeState = create<NodeState>((set) => ({
  nodes: [],

  addNode: (title) =>
    set((state) => {
      const offset = state.nodes.length * 35;
      const uuid = crypto.randomUUID();
      const initialX = 40 + offset;
      const initialY = 40 + offset;

      const newNode: NodeData = {
        id: `input-${uuid}`,
        title,
        x: initialX,
        y: initialY,
        coordinateStartX: initialX + NODE_WIDTH,
        coordinateStartY: initialY + PORT_OFFSET_Y,
        coordinateEndX: null,
        coordinateEndY: null,
      };

      return { nodes: [...state.nodes, newNode] };
    }),

  updatePosition: (id, x, y) =>
    set((state) => {
      return {
        nodes: state.nodes.map((n) =>
          n.id === id
            ? {
                ...n,
                x,
                y,
                coordinateStartX: x + NODE_WIDTH,
                coordinateStartY: y + PORT_OFFSET_Y,
              }
            : n,
        ),
      };
    }),

  setNodeClicked: (id, isNodeClicked) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, isNodeClicked } : n,
      ),
    })),

  clearNode: () => set({ nodes: [] }),
}));

const NormalizationElement = () => {
  const { selectedNormDropdown, setSelectedNormDropdown } =
    useNormalizationState();
  const [isNormalizeDropdownClicked, setIsNormalizeDropdownClicked] =
    useState<boolean>(false);

  const normalizationList = ["Not Normalized", "Min-Max", "Z-Score", "Robust"];

  const handleNormDropdownMenu = (norm: string) => {
    setSelectedNormDropdown(norm);
  };

  return (
    <>
      <span>Normalization Method</span>
      <div
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() =>
          setIsNormalizeDropdownClicked(!isNormalizeDropdownClicked)
        }
        className="bg-dim-white/5 border-dim-white/10 relative flex items-center justify-between rounded-sm border-2 px-4 py-1.5 hover:cursor-pointer"
      >
        <span>{selectedNormDropdown}</span>
        <IconDropdownElement />
        {isNormalizeDropdownClicked && (
          <div className="border-dim-white/20 bg-main-background absolute top-[calc(100%+4px)] left-0 z-10 flex w-full flex-col gap-1 rounded-sm border-2 px-2 py-2">
            {normalizationList.map((norm, index) => (
              <div
                onClick={() => handleNormDropdownMenu(norm)}
                key={index}
                className="hover:bg-dim-white/10 rounded-sm px-3 py-1"
              >
                <span>{norm}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const NormalizationSelectorElement = () => {
  const { selectedNormalizedFeatures, setSelectedNormalizedFeatures } =
    useSelectedNormalizedFeatures();
  const { selectedFeature } = useColumnColor();

  const selectedNameFeature = selectedFeature.selectedNameFeature;
  const isAnySelectedFeature = selectedNameFeature.length !== 0;

  const handleSelectNormalizedFeature = (featureName: string) => {
    setSelectedNormalizedFeatures(featureName);
  };

  return (
    <>
      <span className="mt-2">Normalized Feature</span>
      <div className="border-dim-white/10 rounded-sm border-2 p-2">
        <div className="custom-scrollbar overflow-y-auto">
          <div className="flex max-h-30 min-h-0 flex-col gap-1">
            {isAnySelectedFeature ? (
              selectedNameFeature.map((feature, index) => (
                <div
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => handleSelectNormalizedFeature(feature)}
                  key={index}
                  className={`rounded-sm px-3 py-1.5 hover:cursor-pointer ${
                    selectedNormalizedFeatures.includes(feature) &&
                    "bg-dim-white/5"
                  }`}
                >
                  <span>{feature}</span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center rounded-sm px-3 py-1.5">
                <span>No Feature Selected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const TrainTestSplitElement = () => {
  const { trainValue, setTrainValue } = useTrainPortion();

  const handleTrainValue = (e: ChangeEvent<HTMLInputElement>) => {
    setTrainValue(Number(e.target.value));
  };

  return (
    <>
      <div className="relative w-full">
        <div
          className="pointer-events-none absolute top-full flex -translate-x-1/2 flex-col items-center"
          style={{
            left: `calc(${trainValue}% + ${(50 - trainValue) * 0.16}px)`,
          }}
        >
          <span className="font-jakarta-bold text-main-background absolute top-3.5 text-[10px]">
            {trainValue}%
          </span>
          <IconSliderPointer className="text-unique-yellow h-8 w-8" />
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={trainValue}
          onPointerDown={(e) => e.stopPropagation()}
          onChange={(e) => handleTrainValue(e)}
          style={{
            background: `linear-gradient(to right, #FACC15 ${trainValue}%, #FFFFFF ${trainValue}%)`,
          }}
          className="h-1.5 w-full appearance-none rounded-full accent-white hover:cursor-grab active:cursor-grabbing"
        />
      </div>
    </>
  );
};

export const InputNode = ({ node }: InputNodeProps) => {
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [isPointerMove, setIsPointerMove] = useState<boolean>(false);
  const [isDropdown, setIsDropdown] = useState<boolean>(false);
  const [isGateStartClicked, setIsGateStartClicked] = useState<boolean>(false);
  const [isPointerHoveredToFilename, setIsPointerHoveredToFilename] =
    useState<boolean>(false);

  const updatePosition = useInputNodeState((state) => state.updatePosition);
  const filename = useFilenameState((state) => state.filename);

  const { selectedFeature, selectedLabel } = useColumnColor();
  const { setFirstConnection } = useNodeConnectionState();

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setIsPointerMove(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!isPointerMove) return;

    const newX = node.x + e.movementX;
    const newY = node.y + e.movementY;

    updatePosition(node.id, newX, newY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsPointerMove(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleDropdown = () => {
    setIsDropdown(!isDropdown);
  };

  const handleGateClick = () => {
    setIsGateStartClicked(!isGateStartClicked);
    setFirstConnection(node.id);
  };

  return (
    <div
      onPointerDown={(e) => handlePointerDown(e)}
      onPointerMove={(e) => handlePointerMove(e)}
      onPointerUp={(e) => handlePointerUp(e)}
      className="border-dim-white/10 bg-dim-white/5 absolute flex w-fit flex-col rounded-md border-2 px-4 py-3 hover:cursor-grab active:cursor-grabbing"
      style={{
        transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
      }}
    >
      {/* Node ini bertindak sebagai input */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        onClick={handleGateClick}
        className={`absolute top-5 -right-1 h-5 w-2 rounded-xs hover:cursor-pointer ${isGateStartClicked ? "bg-white" : "bg-unique-yellow"}`}
      ></div>
      <div className="flex flex-col gap-2">
        <div className="text-unique-yellow font-jakarta-bold flex items-center gap-1">
          <IconTableSmall />
          <h2>Input Table</h2>
        </div>
        <div
          onPointerEnter={() => setIsPointerHoveredToFilename(true)}
          onPointerLeave={() => setIsPointerHoveredToFilename(false)}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleDropdown}
          className="bg-dim-white/5 border-dim-white/20 relative z-50 flex items-center justify-between rounded-sm border-2 px-4 py-1.5 hover:cursor-pointer"
        >
          {isPointerHoveredToFilename && (
            <div className="bg-main-background border-dim-white/10 absolute top-full left-0 z-10 rounded-sm border px-4 py-1 text-xs">
              <span>{filename}</span>
            </div>
          )}
          <span className="text-xs">
            {cutStringToDesiredLength(filename, 25)}
          </span>
          <IconDropdownElement />
          {isDropdown && <DropdownTitle />}
        </div>
        <div className="bg-dim-white/10 my-2 h-1 w-64 rounded-full"></div>
      </div>
      <div
        className={`grid gap-1 transition-[grid-template-rows] duration-150 ease-in-out ${
          isPanelOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className={isPanelOpen ? "overflow-visible" : "overflow-hidden"}>
          <div className="flex flex-col gap-1 text-xs">
            <span className="text-unique-yellow text-sm">Selection</span>
            <div className="flex items-center justify-between">
              <span>Feature</span>
              <span>
                {selectedFeature.selectedIndexFeature.length === 0
                  ? "Not Selected"
                  : selectedFeature.selectedIndexFeature.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Label</span>
              <span>
                {selectedLabel.selectedIndexLabel.length === 0
                  ? "Not Selected"
                  : selectedLabel.selectedIndexLabel.length}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-xs">
            <span className="text-unique-yellow mt-2 text-sm">
              Train-Test Split
            </span>
            <TrainTestSplitElement />
          </div>
          <div className="flex flex-col gap-1 pt-7 text-xs">
            <span className="text-unique-yellow mt-2 text-sm">Action</span>
            <NormalizationElement />
            <NormalizationSelectorElement />
          </div>
        </div>
      </div>
      <div
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="bg-unique-yellow mt-2 h-1 w-10 self-center rounded-full hover:cursor-grab active:cursor-grabbing"
      ></div>
    </div>
  );
};
