
import { create } from 'zustand';
import { Node, Edge } from 'reactflow';

interface Flow {
  nodes: Node[];
  edges: Edge[];
}

interface FlowState {
  flows: Record<string, Flow>;
  getFlow: (flowId: string) => Flow | null;
  updateFlow: (flowId: string, flow: Flow) => void;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  flows: {},
  getFlow: (flowId: string) => {
    return get().flows[flowId] || null;
  },
  updateFlow: (flowId: string, flow: Flow) => {
    set((state) => ({
      flows: {
        ...state.flows,
        [flowId]: flow,
      },
    }));
  },
}));
