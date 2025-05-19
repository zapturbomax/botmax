import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Rocket, RotateCcw } from 'lucide-react';

interface BetaFlowControlsProps {
  onSave: () => void;
  onPublish: () => void;
  isSaving?: boolean;
}

/**
 * Componente de controles para o FlowBuilder Beta
 * Inclui botões para salvar rascunho e publicar fluxo
 */
const BetaFlowControls: React.FC<BetaFlowControlsProps> = ({ 
  onSave, 
  onPublish, 
  isSaving = false 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 flex justify-between items-center px-4 py-2">
      <div className="flex items-center">
        <div className="mr-4">
          <h2 className="text-lg font-medium text-gray-800">Flow Builder Beta</h2>
          <p className="text-sm text-gray-500">Crie seu fluxo de conversa</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSave}
          disabled={isSaving}
          className="gap-1"
        >
          {isSaving ? (
            <span className="h-4 w-4 border-2 border-t-transparent border-primary rounded-full animate-spin"></span>
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>Salvar rascunho</span>
        </Button>
        
        <Button 
          size="sm" 
          onClick={onPublish}
          disabled={isSaving}
          className="gap-1 bg-[#26C6B9] hover:bg-[#20B0A5]"
        >
          {isSaving ? (
            <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
          ) : (
            <Rocket className="h-4 w-4" />
          )}
          <span>Publicar</span>
        </Button>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-500 gap-1"
          onClick={() => {}}
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden lg:inline">Reiniciar visualização</span>
        </Button>
      </div>
    </div>
  );
};

export default BetaFlowControls;