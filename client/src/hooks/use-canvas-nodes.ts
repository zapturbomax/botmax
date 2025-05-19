import { useCallback } from 'react';
import { useFlowBuilder } from './use-flow-builder';
import { nodeTypeToCanvas, getCanvasNodeType } from '../components/flow-builder/canvas';

/**
 * Hook para gerenciar a aparência dos nós Canvas no Flow Builder
 */
export function useCanvasNodes() {
  const { nodes, setNodes } = useFlowBuilder();

  /**
   * Atualiza um nó para usar o design Canvas
   */
  const updateNodeToCanvas = useCallback((nodeId: string) => {
    setNodes(
      nodes.map(node => {
        if (node.id === nodeId) {
          // Verificamos se o tipo de nó tem uma versão Canvas
          const canSupport = nodeTypeToCanvas[node.type] !== undefined;
          
          if (canSupport) {
            return {
              ...node,
              type: getCanvasNodeType(node.type),
              data: {
                ...node.data,
                isCanvas: true
              }
            };
          }
        }
        return node;
      })
    );
  }, [nodes, setNodes]);

  /**
   * Atualiza todos os nós para usarem o design Canvas
   */
  const updateAllNodesToCanvas = useCallback(() => {
    setNodes(
      nodes.map(node => {
        // Verificamos se o tipo de nó tem uma versão Canvas
        const canSupport = nodeTypeToCanvas[node.type] !== undefined;
        
        if (canSupport) {
          return {
            ...node,
            type: getCanvasNodeType(node.type),
            data: {
              ...node.data,
              isCanvas: true
            }
          };
        }
        
        return node;
      })
    );
  }, [nodes, setNodes]);

  return {
    updateNodeToCanvas,
    updateAllNodesToCanvas,
  };
}