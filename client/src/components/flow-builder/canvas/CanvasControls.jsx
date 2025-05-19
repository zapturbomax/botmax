import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCanvasNodes } from '@/hooks/use-canvas-nodes';

/**
 * Controles para alternar para o novo design do Canvas
 */
const CanvasControls = () => {
  const { updateAllNodesToCanvas } = useCanvasNodes();

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