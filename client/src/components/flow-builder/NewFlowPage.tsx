import React from 'react';
import { useParams } from 'wouter';
import { FlexSplitter, FlexPanel } from '@/components/ui/flex-splitter';
import NodeSelector from './NodeSelector';
import NewCanvas from './NewCanvas';
import { FlowControllerProvider } from '@/contexts/FlowControllerContext';
import PageHeader from '@/components/PageHeader';
import { Spinner } from '@/components/ui/spinner';
import { useFlowData } from '@/hooks/use-flow-data';
import VisualNodeSettings from './VisualNodeSettings';
import { useState } from 'react';

/**
 * Página do editor de fluxo com o novo design moderno
 */
const NewFlowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  const { 
    flow, 
    isLoading, 
    error, 
    handleSaveDraft, 
    handlePublish, 
    draftMutation, 
    publishMutation
  } = useFlowData(id);
  
  const handleNodeSelect = (node: any) => {
    setSelectedNode(node);
  };
  
  if (isLoading) {
    return (
      <div className="container py-8 h-[calc(100vh-4rem)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  const isSaving = draftMutation.isPending || publishMutation.isPending;
  
  return (
    <FlowControllerProvider flowId={id}>
      <div className="container h-[calc(100vh-4rem)] py-4 max-w-full mx-auto">
        <PageHeader
          title={flow?.name || "Flow Builder"}
          description={flow?.description || "Construtor visual de fluxos para WhatsApp"}
          backUrl="/flows"
          backText="Voltar para Fluxos"
        />
        
        <div className="mt-4 h-[calc(100vh-10rem)] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <FlexSplitter direction="horizontal" initialSizes={[20, 60, 20]}>
            <FlexPanel className="min-w-[240px] max-w-[320px]" minSize={15}>
              <NodeSelector />
            </FlexPanel>
            
            <FlexPanel className="min-w-[400px]">
              <NewCanvas
                onSaveDraft={handleSaveDraft}
                onPublish={handlePublish}
                onNodeSelect={handleNodeSelect}
                isSaving={isSaving}
              />
            </FlexPanel>
            
            <FlexPanel className="min-w-[240px] max-w-[320px]" minSize={15}>
              {selectedNode ? (
                <VisualNodeSettings 
                  node={selectedNode} 
                  onClose={() => setSelectedNode(null)} 
                />
              ) : (
                <div className="h-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 text-center">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Selecione um nó para editar suas propriedades
                    </p>
                  </div>
                </div>
              )}
            </FlexPanel>
          </FlexSplitter>
        </div>
      </div>
    </FlowControllerProvider>
  );
};

export default NewFlowPage;