import React from 'react';
import { useFlowBuilder } from '@/hooks/use-flow-builder';
import { Button } from '@/components/ui/button';
import { Palette, Sparkles, LayoutPanelTop } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { nodeTypeToCanvas, getCanvasNodeType } from './index';

/**
 * Controles para alternar para o novo design do Canvas
 */
const CanvasControls = ({ onUpdateToCanvas }) => {
  const { nodes, setNodes } = useFlowBuilder();

  // Função para atualizar todos os nós para o novo design canvas
  const updateAllNodesToCanvas = () => {
    setNodes(
      nodes.map(node => {
        // Verifica se o tipo de nó tem uma versão canvas
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
    
    if (onUpdateToCanvas) {
      onUpdateToCanvas();
    }
  };

  return (
    <div className="flex items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="default" 
              size="sm" 
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
              onClick={updateAllNodesToCanvas}
            >
              <Sparkles className="h-4 w-4" />
              <span>Novo Design Canvas</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Aplica o novo design moderno e elegante aos nós do fluxo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CanvasControls;