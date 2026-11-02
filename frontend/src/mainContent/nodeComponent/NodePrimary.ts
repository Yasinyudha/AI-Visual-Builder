export interface NodeData {
  id: string;
  title: string;
  x: number;
  y: number;
  coordinateStartX: number | null;
  coordinateStartY: number | null;
  coordinateEndX: number | null;
  coordinateEndY: number | null;
}

export interface InputNodeConnector {
  id: string;
  x: number;
  y: number;
  isInputConnectorClicked: boolean;
}

export interface NodeState {
  nodes: NodeData[];
  addNode: (title: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  setNodeClicked: (id: string, isNodeClicked: boolean) => void;
  clearNode: () => void;
}