
import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';

interface ButtonsPropertiesProps {
  node: Node;
  updateNodeData: (nodeId: string, data: any) => void;
  availableNodes: Node[];
}

const ButtonsProperties: React.FC<ButtonsPropertiesProps> = ({ 
  node, 
  updateNodeData,
  availableNodes
}) => {
  const [text, setText] = useState(node.data.text || '');
  const [buttons, setButtons] = useState(node.data.buttons || []);
  
  // Atualizar estado local quando o nó mudar
  useEffect(() => {
    setText(node.data.text || '');
    setButtons(node.data.buttons || []);
  }, [node.id, node.data]);
  
  // Atualizar dados do nó quando o texto mudar
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    updateNodeData(node.id, { text: newText });
  };
  
  // Adicionar um novo botão
  const addButton = () => {
    if (buttons.length >= 3) return;
    
    const newButton = { label: '', targetNodeId: null };
    const newButtons = [...buttons, newButton];
    setButtons(newButtons);
    updateNodeData(node.id, { buttons: newButtons });
  };
  
  // Remover um botão
  const removeButton = (index: number) => {
    const newButtons = buttons.filter((_, i) => i !== index);
    setButtons(newButtons);
    updateNodeData(node.id, { buttons: newButtons });
  };
  
  // Atualizar o texto de um botão
  const updateButtonLabel = (index: number, label: string) => {
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], label };
    setButtons(newButtons);
    updateNodeData(node.id, { buttons: newButtons });
  };
  
  // Atualizar o nó de destino de um botão
  const updateButtonTarget = (index: number, targetNodeId: string | null) => {
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], targetNodeId };
    setButtons(newButtons);
    updateNodeData(node.id, { buttons: newButtons });
  };
  
  const textCharacterCount = text.length;
  const isTextOverLimit = textCharacterCount > 1024;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium">Texto da Mensagem</label>
          <Badge variant={isTextOverLimit ? "destructive" : "secondary"}>
            {textCharacterCount}/1024
          </Badge>
        </div>
        <Textarea
          value={text}
          onChange={handleTextChange}
          className="min-h-[100px] text-sm resize-none"
          placeholder="Digite o texto que aparecerá acima dos botões..."
        />
        {isTextOverLimit && (
          <p className="text-xs text-destructive mt-1">
            O texto excede o limite de 1024 caracteres do WhatsApp
          </p>
        )}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Botões</label>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={addButton}
            disabled={buttons.length >= 3}
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar
          </Button>
        </div>
        
        {buttons.length === 0 ? (
          <Alert variant="default" className="bg-muted/50">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Adicione pelo menos um botão para este bloco
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {buttons.map((button, index) => (
              <div key={index} className="grid grid-cols-[1fr,auto] gap-2">
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium">Texto do Botão</label>
                      <Badge variant={button.label.length > 20 ? "destructive" : "secondary"} className="text-xs px-1.5 py-0">
                        {button.label.length}/20
                      </Badge>
                    </div>
                    <Input
                      value={button.label}
                      onChange={(e) => updateButtonLabel(index, e.target.value)}
                      placeholder="Clique aqui"
                      className="h-8 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium block mb-1">Próximo Bloco</label>
                    <Select
                      value={button.targetNodeId || ''}
                      onValueChange={(value) => updateButtonTarget(index, value || null)}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Selecione o próximo bloco" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhum (finalizar)</SelectItem>
                        {availableNodes
                          .filter(n => n.id !== node.id)
                          .map(n => (
                            <SelectItem key={n.id} value={n.id}>
                              {n.data.label || `Bloco ${n.id.substring(0, 4)}`}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeButton(index)}
                  className="h-8 w-8 mt-8 self-start"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {buttons.length >= 3 && (
          <p className="text-xs text-muted-foreground mt-2">
            Limite máximo de 3 botões atingido (limite do WhatsApp)
          </p>
        )}
      </div>
    </div>
  );
};

export default ButtonsProperties;
