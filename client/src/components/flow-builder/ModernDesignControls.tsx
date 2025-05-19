import React from 'react';
import { Button } from '@/components/ui/button';
import { useModernNodes } from '@/hooks/use-modern-nodes';
import { Paintbrush, Undo2 } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * Controles para alternar entre o design atual e o design moderno
 */
const ModernDesignControls: React.FC = () => {
  const { updateAllNodesToModern } = useModernNodes();

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
    </div>
  );
};

export default ModernDesignControls;