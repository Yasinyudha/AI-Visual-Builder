import React, { useRef, useState } from "react";
import {
  IconAddNode,
  IconModelNode,
  IconRefreshNode,
  IconTableNode,
  IconTrain,
} from "../Store";
import { create } from "zustand";
import { useFilename } from "./SubSidebarWithFiles";
import {
  InputNode,
  useFilenameState,
  useInputNodeState,
} from "./nodeComponent/NodeInput";
import { ModelNode, useModelNodeState } from "./nodeComponent/NodeModel";
import { getBezierPath } from "../Global";
import { useNodeConnectionState } from "./nodeComponent/NodeConnection";
import { useColumnColor } from "./SubTableSection";

const MIN_SCALE = 50;
const MAX_SCALE = 200;

interface GrapherButtonTemplateProps {
  icon: React.JSX.Element;
  onClick: () => void;
}

interface NodeOptionState {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}

interface LinearRegressionTrainingResult {
  coefficient: string[];
  intercept: string[];
  meanAbsoluteError: string[];
  meanSquaredError: string[];
  rootMeanSquaredError: string[];
  rSquared: string[];
  fValue: string[];
  pValue: string[];

  setCoefficient: (coefficient: string[]) => void;
  setIntercept: (intercept: string[]) => void;
  setMeanAbsoluteError: (meanAbsoluteError: string[]) => void;
  setMeanSquaredError: (meanSquaredError: string[]) => void;
  setRootMeanSquaredError: (rootMeanSquaredError: string[]) => void;
  setRSquared: (rSquared: string[]) => void;
  setFValue: (fValue: string[]) => void;
  setPValue: (pValue: string[]) => void;
}

interface TrainState {
  isTrain: boolean;
  setIsTrain: (isTrain: boolean) => void;
}

export const useTrainState = create<TrainState>((set) => ({
  isTrain: false,
  setIsTrain: (isTrain) => set({ isTrain: isTrain }),
}));

export const useLinearRegressionTrainingResult =
  create<LinearRegressionTrainingResult>((set) => ({
    coefficient: [],
    intercept: [],
    meanAbsoluteError: [],
    meanSquaredError: [],
    rootMeanSquaredError: [],
    rSquared: [],
    fValue: [],
    pValue: [],

    setCoefficient: (coefficient) => set({ coefficient: coefficient }),
    setIntercept: (intercept) => set({ intercept: intercept }),
    setMeanAbsoluteError: (meanAbsoluteError) =>
      set({ meanAbsoluteError: meanAbsoluteError }),
    setMeanSquaredError: (meanSquaredError) =>
      set({ meanSquaredError: meanSquaredError }),
    setRootMeanSquaredError: (rootMeanSquaredError) =>
      set({ rootMeanSquaredError: rootMeanSquaredError }),
    setRSquared: (rSquared) => set({ rSquared: rSquared }),
    setFValue: (fValue) => set({ fValue: fValue }),
    setPValue: (pValue) => set({ pValue: pValue }),
  }));

const useNodeOptionState = create<NodeOptionState>((set) => ({
  isActive: false,
  setIsActive: (isActive) => set({ isActive: isActive }),
}));

const NodeOption = () => {
  const Icons = [<IconTableNode />, <IconModelNode />];
  const nodeNames = ["Input", "Model"];

  const [numActive, setNumActive] = useState<number | null>(null);

  const filename = useFilename((state) => state.filename);
  const addNode = useInputNodeState((state) => state.addNode);
  const addModel = useModelNodeState((state) => state.addNode);

  const { isActive, setIsActive } = useNodeOptionState();

  const handleAddGrapher = () => {
    if (numActive === 0) {
      addNode(filename || "Untitled Dataset");
    }
    if (numActive === 1) {
      addModel("Type Model");
    }

    // Set visibility ke false setelah klik add grapher
    setIsActive(!isActive);
  };

  return (
    <div className="border-dim-white/10 bg-dim-white/5 flex w-[50%] flex-col gap-10 rounded-md border-2 px-10 pt-8 pb-10">
      <div className="flex flex-col gap-1">
        <h2 className="font-jakarta-bold text-lg">Choose your node</h2>
        <span className="font-jakarta-regular text-sm">
          To add new node, please select category of a node
        </span>
      </div>
      <div className="flex gap-5">
        {Icons.map((Icon, index) => (
          <div
            onClick={() => setNumActive(index)}
            className="flex flex-col items-center gap-2"
            key={index}
          >
            <div
              className={`bg-dim-white/5 rounded-md border-2 p-5 hover:cursor-pointer ${
                numActive === index
                  ? "border-unique-yellow"
                  : "border-dim-white/10"
              }`}
            >
              {Icon}
            </div>
            <span className="text-xs">{nodeNames[index]}</span>
          </div>
        ))}
      </div>
      <button
        onClick={handleAddGrapher}
        className="bg-unique-yellow font-jakarta-medium text-grey w-fit self-end rounded-md px-4 py-2 text-xs hover:cursor-pointer"
      >
        <span>Add to Grapher</span>
      </button>
    </div>
  );
};

const GrapherButtonTemplate = ({
  icon,
  onClick,
}: GrapherButtonTemplateProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-grey border-unique-yellow flex items-center justify-center rounded-md border p-3 hover:cursor-pointer"
    >
      {icon}
    </div>
  );
};

export const GrapherSection = () => {
  const [scale, setScale] = useState<number>(100);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const { isActive, setIsActive } = useNodeOptionState();
  const {
    setCoefficient,
    setIntercept,
    setMeanAbsoluteError,
    setMeanSquaredError,
    setRootMeanSquaredError,
    setRSquared,
    setFValue,
    setPValue,
  } = useLinearRegressionTrainingResult();
  const { setIsTrain } = useTrainState();

  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const clearInputNodes = useInputNodeState((state) => state.clearNode);
  const clearModelNodes = useModelNodeState((state) => state.clearNode);
  const nodes = useInputNodeState((state) => state.nodes);
  const models = useModelNodeState((state) => state.nodes);
  const connection = useNodeConnectionState((state) => state.connection);

  const handleGrapherScaling = (e: React.WheelEvent<HTMLDivElement>) => {
    const scrollMovement = e.deltaY * 0.05;

    setScale((prevScale) => {
      const nextScale = prevScale - scrollMovement;
      return Math.min(Math.max(nextScale, MIN_SCALE), MAX_SCALE);
    });
  };

  const handleGrapherPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;

    setIsPanning(true);
    panStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    };
  };

  const handleGrapherDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning) return;

    setPan({
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y,
    });
  };

  const handleGrapherPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPanning) {
      setIsPanning(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handleAddNode = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    clearInputNodes();
    clearModelNodes();
  };

  const handleTrain = async () => {
    try {
      const apiEndpoint: string = import.meta.env.VITE_API_ENDPOINT;
      const filename = useFilenameState.getState().filename;
      const features =
        useColumnColor.getState().selectedFeature.selectedNameFeature;
      const labels = useColumnColor.getState().selectedLabel.selectedNameLabel;

      const response = await fetch(apiEndpoint + "/api/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: filename,
          features: features,
          labels: labels,
          type: "Linear Regression",
        }),
      });

      if (response.ok) {
        setIsTrain(true);
        const data = await response.json();
        const evals = data.evaluation;

        setCoefficient(data.coefficient);
        setIntercept(data.intercept);
        setMeanAbsoluteError(evals.mae);
        setMeanSquaredError(evals.mse);
        setRootMeanSquaredError(evals.rmse);
        setRSquared(evals.r_squared);
        setFValue(evals.f_value);
        setPValue(evals.p_value);
      }
    } catch (error) {
      setIsTrain(false);
      console.error("Training failed:", error);
    }
  };

  return (
    <div
      onWheel={handleGrapherScaling}
      onPointerDown={handleGrapherPointerDown}
      onPointerUp={handleGrapherPointerUp}
      onPointerMove={handleGrapherDrag}
      className={`border-grey relative h-full w-full overflow-hidden border-b select-none ${
        isPanning ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <div className="absolute top-0 right-0 z-20 flex flex-col gap-2 pt-4 pr-8">
        <GrapherButtonTemplate icon={<IconAddNode />} onClick={handleAddNode} />
        <GrapherButtonTemplate
          icon={<IconRefreshNode />}
          onClick={handleReset}
        />
        <GrapherButtonTemplate icon={<IconTrain />} onClick={handleTrain} />
      </div>
      {isActive && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <div className="pointer-events-auto flex w-full justify-center">
            <NodeOption />
          </div>
        </div>
      )}
      <div
        className={`relative h-full w-full transition-transform duration-75 ease-out ${
          isPanning ?? "transition-transform duration-75 ease-out"
        }`}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale / 100})`,
          transformOrigin: "center center",
        }}
      >
        {nodes.map((node) => (
          <InputNode key={node.id} node={node} />
        ))}
        {models.map((model) => (
          <ModelNode key={model.id} node={model} />
        ))}

        {/* Node connections (SVG) */}
        {connection.map((conn, connId) => {
          const inputNode =
            nodes.find((n) => n.id === conn.fromNodeId) ||
            models.find((n) => n.id === conn.fromNodeId);
          const targetNode = models.find((n) => n.id === conn.toNodeId);

          if (
            !inputNode ||
            !targetNode ||
            inputNode.coordinateStartX == null ||
            inputNode.coordinateStartY == null ||
            targetNode.coordinateEndX == null ||
            targetNode.coordinateEndY == null
          ) {
            return null;
          }

          return (
            <svg
              key={connId}
              className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
            >
              <path
                d={getBezierPath(
                  inputNode.coordinateStartX,
                  inputNode.coordinateStartY,
                  targetNode.coordinateEndX,
                  targetNode.coordinateEndY,
                )}
                stroke="#FACC15"
                strokeWidth={2.5}
                fill="none"
              />
            </svg>
          );
        })}
      </div>
    </div>
  );
};
