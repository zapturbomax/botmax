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

  /**
   * Atualiza todos os nós para usarem a versão V2 com o design exato do dispara.ai
   */
  const updateAllNodesToV2 = useCallback(() => {
    setNodes(
      nodes.map(node => {
        const getV2Type = (type: string | undefined) => {
          if (!type) return 'textMessageV2'; // Fallback para um tipo padrão
          
          // Mapeamento de tipos para versão V2
          const v2Types: Record<string, string> = {
            'textMessage': 'textMessageV2',
            'mediaMessage': 'mediaMessageV2',
            'audioMessage': 'audioMessageV2',
            'quickReplies': 'quickRepliesV2',
            'waitResponse': 'waitResponseV2',
            'contactMessage': 'contactMessageV2'
          };
          
          return v2Types[type] || type;
        };

        return {
          ...node,
          type: getV2Type(node.type),
          data: {
            ...node.data,
            isV2: true
          }
        };
      })
    );
  }, [nodes, setNodes]);

  return {
    updateNodeToModern,
    updateAllNodesToModern,
    updateAllNodesToV2,
  };
}