import { Button } from '@/components/ui/button';
import { Save, Rocket, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import ModernDesignControls from './ModernDesignControls';

interface FlowControlsProps {
  onSave: () => void;
  onPublish: () => void;
  isSaving?: boolean;
}

const FlowControls = ({ onSave, onPublish, isSaving = false }: FlowControlsProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center px-4 py-2">
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
          <span className="hidden sm:inline">Save Draft</span>
          <span className="sm:hidden">Save</span>
        </Button>
        
        <Button 
          size="sm" 
          onClick={onPublish}
          disabled={isSaving}
          className="gap-1"
        >
          {isSaving ? (
            <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
          ) : (
            <Rocket className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Publish</span>
          <span className="sm:hidden">Publish</span>
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <ModernDesignControls />
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-500 dark:text-gray-400 gap-1"
          onClick={() => {}}
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden lg:inline">Reset View</span>
        </Button>
      </div>
    </div>
  );
};

export default FlowControls;
