import { useCallback } from 'react';
import { useFlowBuilder } from './use-flow-builder';

/**
 * Hook para gerenciar a aparência moderna dos nós no Flow Builder
 */
export function useModernNodes() {
  const { nodes, setNodes } = useFlowBuilder();

  /**
   * Atualiza um nó para usar a versão moderna
   */
  const updateNodeToModern = useCallback((nodeId: string) => {
    setNodes(
      nodes.map(node => {
        if (node.id === nodeId) {
          // Mapeamento de tipos de nós para suas versões modernas
          const getModernType = (type: string | undefined) => {
            if (!type) return 'textMessage'; // Fallback para um tipo padrão
            
            const modernTypes: Record<string, string> = {
              'textMessage': 'textMessage',
              'mediaMessage': 'mediaMessage',
              'audioMessage': 'audioMessage',
              'quickReplies': 'quickReplies',
              'waitResponse': 'waitResponse',
              'contactMessage': 'contactMessage',
            };
            return modernTypes[type] || type;
          };

          return {
            ...node,
            type: getModernType(node.type),
            data: {
              ...node.data,
              isModern: true
            }
          };
        }
        return node;
      })
    );
  }, [nodes, setNodes]);

  /**
   * Atualiza todos os nós para usarem a versão moderna
   */
  const updateAllNodesToModern = useCallback(() => {
    setNodes(
      nodes.map(node => {
        // Mapeamento de tipos de nós para suas versões modernas
        const getModernType = (type: string | undefined) => {
          if (!type) return 'textMessage'; // Fallback para um tipo padrão
          
          const modernTypes: Record<string, string> = {
            'textMessage': 'textMessage',
            'mediaMessage': 'mediaMessage',
            'audioMessage': 'audioMessage',
            'quickReplies': 'quickReplies',
            'waitResponse': 'waitResponse',
            'contactMessage': 'contactMessage',
          };
          return modernTypes[type] || type;
        };

        return {
          ...node,
          type: getModernType(node.type),
          data: {
            ...node.data,
            isModern: true
          }
        };
      })
    );
  }, [nodes, setNodes]);

  return {
    updateNodeToModern,
    updateAllNodesToModern,
  };
}