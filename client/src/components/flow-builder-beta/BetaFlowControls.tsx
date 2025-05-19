import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Rocket, Info, RefreshCw, BarChart } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BetaFlowControlsProps {
  onSave: () => void;
  onPublish: () => void;
  isSaving?: boolean;
}

/**
 * Barra de controles superior do Flow Builder Beta
 * Contém botões para salvar, publicar e informações do fluxo
 */
const BetaFlowControls = ({ onSave, onPublish, isSaving = false }: BetaFlowControlsProps) => {
  return (
    <div className="bg-[#3A4049] text-white p-3 border-b border-gray-700 flex items-center justify-between">
      <div className="flex items-center">
        <div className="font-medium mr-5 text-[#26C6B9]">FlowBot Beta</div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </>
          )}
        </Button>
        
        <Button 
          variant="ghost"
          size="sm"
          className="text-gray-300 hover:text-white hover:bg-gray-700 ml-2"
          onClick={onPublish}
          disabled={isSaving}
        >
          <Rocket className="h-4 w-4 mr-2" />
          Publicar
        </Button>
      </div>
      
      <div className="flex items-center text-sm">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center bg-gray-700 px-2 py-1 rounded-md mr-3">
                <RefreshCw className="h-4 w-4 text-green-400 mr-1" />
                <span className="font-medium mr-1">Executando:</span>
                <span>42</span>
                <Info className="h-3 w-3 ml-1 text-gray-400" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-56 text-xs">
                Número de fluxos atualmente em execução com contatos ativos.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center bg-gray-700 px-2 py-1 rounded-md">
                <BarChart className="h-4 w-4 text-blue-400 mr-1" />
                <span className="font-medium mr-1">Enviados:</span>
                <span>1.248</span>
                <Info className="h-3 w-3 ml-1 text-gray-400" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-56 text-xs">
                Total de mensagens enviadas por este fluxo desde a sua criação.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default BetaFlowControls;