# Prompt 11: Hook para Gerenciamento de Fluxos (use-flow-store.ts)

Este hook implementa o armazenamento e gerenciamento dos fluxos usando Zustand, permitindo persistência e manipulação dos dados.

```tsx
// src/hooks/use-flow-store.ts
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
```

## Características Principais

1. **Zustand**: Utiliza a biblioteca Zustand para gerenciamento de estado
2. **Persistência**: Usa o middleware `persist` para salvar os fluxos no localStorage
3. **CRUD Completo**: Implementa operações de criação, leitura, atualização e exclusão de fluxos
4. **Timestamps**: Mantém registro de criação e atualização de cada fluxo
5. **Tipagem**: Utiliza TypeScript para garantir a integridade dos dados

Este hook é fundamental para o funcionamento do Flow Builder, pois gerencia todo o estado dos fluxos, permitindo que sejam salvos, carregados e modificados. Ele é utilizado pelo componente `FlowCanvas` para carregar e salvar o estado do fluxo atual.
