import React from 'react';
import { Button } from '@/components/ui/button';
import { useModernNodes } from '@/hooks/use-modern-nodes';
import { Paintbrush, Sparkles } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * Controles para alternar entre os diferentes designs de nós
 */
const ModernDesignControls: React.FC = () => {
  const { updateAllNodesToModern, updateAllNodesToV2 } = useModernNodes();

  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-1 bg-white"
              onClick={updateAllNodesToModern}
            >
              <Paintbrush className="h-4 w-4 text-purple-500" />
              <span>Redesign Moderno</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Atualiza todos os nós para o novo design</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-1 bg-white"
              onClick={updateAllNodesToV2}
            >
              <Sparkles className="h-4 w-4 text-[#26C6B9]" />
              <span>Design Dispara.ai</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Aplica o design exato do Dispara.ai aos nós</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ModernDesignControls;