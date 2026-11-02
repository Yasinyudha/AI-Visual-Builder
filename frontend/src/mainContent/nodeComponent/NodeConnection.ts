import { create } from "zustand";

export interface NodeConnection {
  fromNodeId: string;
  toNodeId: string;
}

export interface NodeConnectionState {
  connection: NodeConnection[];
  firstConnection: string;
  setFirstConnection: (firstConnection: string) => void;
  setConnection: (toNodeId: string) => void;
}

export const useNodeConnectionState = create<NodeConnectionState>((set) => ({
  connection: [],
  firstConnection: "",
  setFirstConnection: (firstConnection) => set({ firstConnection: firstConnection }),
  setConnection: (toNodeId) => set((state) => {
    if (!state.firstConnection || state.firstConnection === toNodeId) {
      return {}
    }

    return {
      connection: [
        ...state.connection,
        { fromNodeId: state.firstConnection, toNodeId }
      ],
      firstConnection: "",
    }
  }) 
}))