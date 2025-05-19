
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Node, Edge } from 'reactflow';

interface Flow {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
}

interface FlowStore {
  flows: Record<string, Flow>;
  getFlow: (id: string) => Flow | null;
  createFlow: (name: string) => string;
  updateFlow: (id: string, data: Partial<Flow>) => void;
  deleteFlow: (id: string) => void;
}

export const useFlowStore = create<FlowStore>()(
  persist(
    (set, get) => ({
      flows: {},
      
      getFlow: (id) => {
        return get().flows[id] || null;
      },
      
      createFlow: (name) => {
        const id = `flow_${Date.now()}`;
        const newFlow: Flow = {
          id,
          name,
          nodes: [],
          edges: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          flows: {
            ...state.flows,
            [id]: newFlow,
          },
        }));
        
        return id;
      },
      
      updateFlow: (id, data) => {
        set((state) => {
          const flow = state.flows[id];
          if (!flow) return state;
          
          return {
            flows: {
              ...state.flows,
              [id]: {
                ...flow,
                ...data,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },
      
      deleteFlow: (id) => {
        set((state) => {
          const { [id]: _, ...rest } = state.flows;
          return { flows: rest };
        });
      },
    }),
    {
      name: 'flow-store',
    }
  )
);
