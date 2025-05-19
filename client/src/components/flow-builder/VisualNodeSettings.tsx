import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFlowController } from '@/contexts/FlowControllerContext';

interface VisualNodeSettingsProps {
  node: any;
  onClose: () => void;
}

const VisualNodeSettings: React.FC<VisualNodeSettingsProps> = ({ node, onClose }) => {
  const { setNodes } = useFlowController();
  
  const updateNodeData = (newData: any) => {
    setNodes((nodes) => 
      nodes.map((n) => 
        n.id === node.id ? { ...n, data: { ...n.data, ...newData } } : n
      )
    );
  };
  
  // Renderiza diferentes configurações com base no tipo de nó
  const renderNodeSettings = () => {
    switch (node.type) {
      case 'textMessage':
      case 'textMessageV2':
      case 'textMessageCanvas':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="message-text">Mensagem de texto</Label>
              <Textarea
                id="message-text"
                value={node.data.text || ''}
                onChange={(e) => updateNodeData({ text: e.target.value })}
                placeholder="Digite o texto da mensagem"
                className="min-h-[120px]"
              />
            </div>
            
            <div>
              <Label htmlFor="delay">Atraso antes de enviar (segundos)</Label>
              <Input
                id="delay"
                type="number"
                min={0}
                value={node.data.delay || 0}
                onChange={(e) => updateNodeData({ delay: Number(e.target.value) || 0 })}
              />
            </div>
          </div>
        );
        
      case 'mediaMessage':
      case 'mediaMessageCanvas':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="media-url">URL da mídia</Label>
              <Input
                id="media-url"
                value={node.data.mediaUrl || ''}
                onChange={(e) => updateNodeData({ mediaUrl: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            
            <div>
              <Label htmlFor="caption">Legenda</Label>
              <Textarea
                id="caption"
                value={node.data.caption || ''}
                onChange={(e) => updateNodeData({ caption: e.target.value })}
                placeholder="Legenda opcional para a mídia"
                className="min-h-[80px]"
              />
            </div>
            
            <div>
              <Label htmlFor="media-type">Tipo de mídia</Label>
              <select
                id="media-type"
                value={node.data.mediaType || 'image'}
                onChange={(e) => updateNodeData({ mediaType: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="image">Imagem</option>
                <option value="video">Vídeo</option>
                <option value="audio">Áudio</option>
                <option value="document">Documento</option>
              </select>
            </div>
          </div>
        );
        
      case 'quickReplies':
      case 'buttonsCanvas':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="header-text">Texto do cabeçalho</Label>
              <Input
                id="header-text"
                value={node.data.headerText || ''}
                onChange={(e) => updateNodeData({ headerText: e.target.value })}
                placeholder="Texto acima dos botões"
              />
            </div>
            
            <div>
              <Label>Botões</Label>
              <div className="space-y-2 mt-2">
                {(node.data.buttons || []).map((button: any, index: number) => (
                  <div key={button.id || index} className="flex flex-col gap-2 p-2 border rounded-md">
                    <Input
                      value={button.text || ''}
                      onChange={(e) => {
                        const newButtons = [...(node.data.buttons || [])];
                        newButtons[index] = { ...newButtons[index], text: e.target.value };
                        updateNodeData({ buttons: newButtons });
                      }}
                      placeholder={`Texto do botão ${index + 1}`}
                    />
                    <Input
                      value={button.value || ''}
                      onChange={(e) => {
                        const newButtons = [...(node.data.buttons || [])];
                        newButtons[index] = { ...newButtons[index], value: e.target.value };
                        updateNodeData({ buttons: newButtons });
                      }}
                      placeholder={`Valor do botão ${index + 1}`}
                      className="text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'waitResponse':
      case 'waitResponseCanvas':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="timeout">Tempo limite (segundos)</Label>
              <Input
                id="timeout"
                type="number"
                min={0}
                value={node.data.timeout || 60}
                onChange={(e) => updateNodeData({ timeout: Number(e.target.value) || 60 })}
              />
            </div>
            
            <div>
              <Label htmlFor="variable-name">Nome da variável</Label>
              <Input
                id="variable-name"
                value={node.data.variableName || 'resposta'}
                onChange={(e) => updateNodeData({ variableName: e.target.value })}
                placeholder="Nome para armazenar a resposta"
              />
            </div>
            
            <div>
              <Label htmlFor="timeout-message">Mensagem de tempo esgotado</Label>
              <Textarea
                id="timeout-message"
                value={node.data.timeoutMessage || ''}
                onChange={(e) => updateNodeData({ timeoutMessage: e.target.value })}
                placeholder="Mensagem quando o tempo expirar"
                className="min-h-[80px]"
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="p-4 text-center text-gray-500">
            <p>Selecione um nó para editar suas propriedades</p>
          </div>
        );
    }
  };
  
  if (!node) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Selecione um nó para editar suas propriedades</p>
      </div>
    );
  }
  
  return (
    <div className="h-full bg-white dark:bg-gray-950 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 p-4">
        <h3 className="font-medium text-lg">Propriedades do nó</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <Label htmlFor="node-id">ID do nó</Label>
          <Input id="node-id" value={node.id} readOnly className="bg-gray-50 dark:bg-gray-900" />
        </div>
        
        <div>
          <Label htmlFor="node-type">Tipo</Label>
          <Input id="node-type" value={node.type} readOnly className="bg-gray-50 dark:bg-gray-900" />
        </div>
        
        {renderNodeSettings()}
      </div>
    </div>
  );
};

export default VisualNodeSettings;