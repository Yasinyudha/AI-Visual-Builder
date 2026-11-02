import { useState, type ChangeEvent } from "react";
import { create } from "zustand";
import { IconDropdownElement, IconTableSmall } from "../../Store";
import { type NodeData, type NodeState } from "./NodePrimary";
import { useNodeConnectionState } from "./NodeConnection";

const NODE_WIDTH_START = 288;
const NODE_WIDTH_END = 0;
const PORT_OFFSET_Y = 30;

interface ModelNodeProps {
  node: NodeData;
}

interface ModelSelectionState {
  selectedModel: string;
  setSelectedModel: (selectedModel: string) => void;
}

interface GeneralHyperparameterInputTemplateProps {
  nameHyperparameter: string;
  setValue: (value: string) => void;
}

interface ModelInfoState {
  // General hyperparameters
  learningRate: string | null;
  iteration: string | null;

  setLearningRate: (learningRate: string) => void;
  setIteration: (interation: string) => void;
}

export const useModelInfoState = create<ModelInfoState>((set) => ({
  // General hyperparameters
  learningRate: null,
  iteration: null,

  setLearningRate: (learningRate) => set({ learningRate: learningRate }),
  setIteration: (iteration) => set({ iteration: iteration }),
}));

const useModelSelectionStore = create<ModelSelectionState>((set) => ({
  selectedModel: "Linear Regression",
  setSelectedModel: (selectedModel) => set({ selectedModel: selectedModel }),
}));

export const useModelNodeState = create<NodeState>((set) => ({
  nodes: [],

  addNode: (title) =>
    set((state) => {
      const offset = state.nodes.length * 35;
      const uuid = crypto.randomUUID();
      const initialX = 40 + offset;
      const initialY = 40 + offset;

      const newNode: NodeData = {
        id: `model-${uuid}`,
        title,
        x: initialX,
        y: initialY,
        coordinateStartX: initialX + NODE_WIDTH_START,
        coordinateStartY: initialY + PORT_OFFSET_Y,
        coordinateEndX: initialX + NODE_WIDTH_END,
        coordinateEndY: initialY + PORT_OFFSET_Y,
      };

      return { nodes: [...state.nodes, newNode] };
    }),

  updatePosition: (id, x, y) =>
    set((state) => ({
      nodes: state.nodes.map((n) => {
        if (n.id !== id) return n;

        return {
          ...n,
          x,
          y,
          coordinateStartX: x + NODE_WIDTH_START,
          coordinateStartY: y + PORT_OFFSET_Y,
          coordinateEndX: x + NODE_WIDTH_END,
          coordinateEndY: y + PORT_OFFSET_Y,
        };
      }),
    })),

  setNodeClicked: (id, isNodeClicked) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, isNodeClicked } : n,
      ),
    })),

  clearNode: () => set({ nodes: [] }),
}));

const DropdownContainerModel = () => {
  const setSelectedModel = useModelSelectionStore(
    (state) => state.setSelectedModel,
  );
  const modelNames = [
    "Linear Regression",
    "Polynomial Regression",
    "Ridge Regression",
  ];

  const handleModelSelect = (modelName: string) => {
    setSelectedModel(modelName);
  };

  return (
    <div className="border-dim-white/40 bg-main-background absolute top-full left-0 z-50 mt-1 flex w-full flex-col gap-1 rounded-md border-2 px-2 py-2 text-xs">
      {modelNames.map((model, index) => (
        <div
          key={index}
          onClick={() => handleModelSelect(model)}
          className="hover:bg-dim-white/10 flex w-full items-center rounded-md px-2 py-1"
        >
          <span>{model}</span>
        </div>
      ))}
    </div>
  );
};

const GeneralHyperparameterInputTemplate = ({
  nameHyperparameter,
  setValue,
}: GeneralHyperparameterInputTemplateProps) => {
  const [learningRate, setLearningRate] = useState<string | null>(null);

  const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLearningRate(value);
  };

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      className="flex items-center justify-between"
    >
      <span>{nameHyperparameter}</span>
      <div className="border-dim-white/10 flex w-[30%] items-center justify-center rounded-sm border-2 px-3 py-1 text-xs text-white">
        <input
          value={learningRate ?? ""}
          onChange={(e) => {
            handleValue(e);
            setValue(e.target.value);
          }}
          className="w-full text-center outline-none active:outline-none"
        />
      </div>
    </div>
  );
};

const GeneralHyperparameterElement = () => {
  const { setLearningRate, setIteration } = useModelInfoState();

  return (
    <div className="flex flex-col gap-1.5 text-xs">
      <span className="text-unique-yellow text-sm">
        General Hyperparameters
      </span>
      <GeneralHyperparameterInputTemplate
        nameHyperparameter="Learning Rate"
        setValue={(e) => setLearningRate(e)}
      />
      <GeneralHyperparameterInputTemplate
        nameHyperparameter="Iterations"
        setValue={(e) => setIteration(e)}
      />
    </div>
  );
};

export const ModelNode = ({ node }: ModelNodeProps) => {
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [isPointerMove, setIsPointerMove] = useState<boolean>(false);
  const [isDropdown, setIsDropdown] = useState<boolean>(false);
  const [isGateEndClicked, setIsGateEndClicked] = useState<boolean>(false);
  const [isGateStartClicked, setIsGateStartClicked] = useState<boolean>(false);

  const selectedModel = useModelSelectionStore((state) => state.selectedModel);

  const { updatePosition } = useModelNodeState();
  const { setConnection } = useNodeConnectionState();
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

    const box = e.currentTarget;
    const container = box.parentElement;

    if (!container) return;

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

  const handleGateEndClick = () => {
    setIsGateEndClicked(!isGateEndClicked);
    setConnection(node.id);
  };

  const handleGateStartClick = () => {
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
      <div
        onPointerDown={(e) => e.stopPropagation()}
        onClick={handleGateStartClick}
        className={`bg-unique-yellow absolute top-5 -right-1 z-50 h-5 w-2 rounded-xs hover:cursor-pointer ${isGateStartClicked ? "bg-white" : "bg-unique-yellow"}`}
      ></div>
      <div
        onPointerDown={(e) => e.stopPropagation()}
        onClick={handleGateEndClick}
        className={`absolute top-5 -left-1 h-5 w-2 rounded-xs hover:cursor-pointer ${isGateEndClicked ? "bg-white" : "bg-unique-yellow"}`}
      ></div>
      <div className="flex flex-col gap-2">
        <div className="text-unique-yellow font-jakarta-bold flex items-center gap-1">
          <IconTableSmall />
          <h2>Input Model</h2>
        </div>
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleDropdown}
          className="bg-dim-white/5 border-dim-white/20 relative z-50 flex items-center justify-between rounded-sm border-2 px-4 py-1.5 hover:cursor-pointer"
        >
          <span className="text-xs">{selectedModel}</span>
          <IconDropdownElement />
          {isDropdown && <DropdownContainerModel />}
        </div>
        <div className="bg-dim-white/10 my-2 h-1 w-64 rounded-full"></div>
      </div>
      <div
        className={`grid gap-1 transition-[grid-template-rows] duration-150 ease-in-out ${
          isPanelOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <GeneralHyperparameterElement />
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
