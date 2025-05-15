import { useState, useEffect } from 'react';
import { Plus, MessageCircle, Image, List, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { nodeTypes } from './FlowNodeTypes';
import { FlowNode } from '@shared/schema';

interface NodePopoverProps {
  node: FlowNode;
  onUpdate: (nodeId: string, data: Record<string, any>) => void;
  onAddBlock: () => void;
}

export function NodePopover({ node, onUpdate, onAddBlock }: NodePopoverProps) {
  const [open, setOpen] = useState(false);
  const [localData, setLocalData] = useState<Record<string, any>>({});
  const nodeType = nodeTypes.find(t => t.type === node.type);
  
  useEffect(() => {
    if (node) {
      setLocalData(node.data || {});
    }
  }, [node]);
  
  const handleChange = (key: string, value: any) => {
    setLocalData(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleApplyChanges = () => {
    onUpdate(node.id, localData);
    setOpen(false);
  };
  
  // Render fields based on node type
  const renderFields = () => {
    switch (node.type) {
      case 'textMessage':
        return (
          <>
            <div>
              <Label>Mensagem</Label>
              <Textarea 
                value={localData.text || ''} 
                onChange={(e) => handleChange('text', e.target.value)}
                placeholder="Digite sua mensagem..."
                rows={4}
              />
            </div>
            <div>
              <Label>Variáveis</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChange(
                    'text', 
                    (localData.text || '') + " {{first_name}}"
                  )}
                >
                  {"{{first_name}}"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChange(
                    'text', 
                    (localData.text || '') + " {{last_name}}"
                  )}
                >
                  {"{{last_name}}"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChange(
                    'text', 
                    (localData.text || '') + " {{phone}}"
                  )}
                >
                  {"{{phone}}"}
                </Button>
              </div>
            </div>
          </>
        );
      
      case 'quickReplies':
        return (
          <>
            <div>
              <Label>Mensagem</Label>
              <Textarea 
                value={localData.text || ''} 
                onChange={(e) => handleChange('text', e.target.value)}
                placeholder="Digite sua mensagem..."
                rows={3}
              />
            </div>
            <div>
              <Label>Botões de Resposta Rápida</Label>
              <div className="space-y-2 mt-2">
                {(localData.buttons || []).map((button: any, index: number) => (
                  <div key={button.id || index} className="flex items-center gap-2">
                    <Input 
                      value={button.title || ''} 
                      onChange={(e) => {
                        const newButtons = [...(localData.buttons || [])];
                        newButtons[index].title = e.target.value;
                        handleChange('buttons', newButtons);
                      }}
                      placeholder="Título do botão"
                      className="flex-1"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        const newButtons = [...(localData.buttons || [])];
                        newButtons.splice(index, 1);
                        handleChange('buttons', newButtons);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => {
                    const newButtons = [...(localData.buttons || []), { id: Date.now().toString(), title: '' }];
                    handleChange('buttons', newButtons);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Botão
                </Button>
              </div>
            </div>
          </>
        );
      
      case 'condition':
        return (
          <>
            <div>
              <Label>Condição</Label>
              <Textarea 
                value={localData.condition || ''} 
                onChange={(e) => handleChange('condition', e.target.value)}
                placeholder="{{variable}} === 'value'"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use JavaScript syntax. Example: <code>{"{{variable}} === 'value'"}</code>
              </p>
            </div>
          </>
        );
        
      case 'waitResponse':
        return (
          <>
            <div>
              <Label>Nome da Variável</Label>
              <Input 
                value={localData.variableName || ''} 
                onChange={(e) => handleChange('variableName', e.target.value)}
                placeholder="response"
              />
              <p className="text-xs text-gray-500 mt-1">
                A resposta do usuário será salva nesta variável
              </p>
            </div>
            <div>
              <Label>Tempo limite (minutos)</Label>
              <Input 
                type="number" 
                value={localData.timeoutMinutes || 60} 
                onChange={(e) => handleChange('timeoutMinutes', parseInt(e.target.value, 10) || 0)}
                min={1}
                max={1440}
              />
            </div>
          </>
        );
        
      case 'setVariable':
        return (
          <>
            <div>
              <Label>Nome da Variável</Label>
              <Input 
                value={localData.variableName || ''} 
                onChange={(e) => handleChange('variableName', e.target.value)}
                placeholder="myVariable"
              />
            </div>
            <div>
              <Label>Valor</Label>
              <Input 
                value={localData.value || ''} 
                onChange={(e) => handleChange('value', e.target.value)}
                placeholder="valor"
              />
            </div>
          </>
        );
        
      case 'delay':
        return (
          <>
            <div>
              <Label>Horas</Label>
              <Input 
                type="number" 
                value={localData.delayHours || 0} 
                onChange={(e) => handleChange('delayHours', parseInt(e.target.value, 10) || 0)}
                min={0}
                max={24}
              />
            </div>
            <div>
              <Label>Minutos</Label>
              <Input 
                type="number" 
                value={localData.delayMinutes || 0} 
                onChange={(e) => handleChange('delayMinutes', parseInt(e.target.value, 10) || 0)}
                min={0}
                max={59}
              />
            </div>
          </>
        );
        
      case 'humanTransfer':
        return (
          <>
            <div>
              <Label>Mensagem</Label>
              <Textarea 
                value={localData.message || ''} 
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Digite a mensagem a ser mostrada antes da transferência..."
                rows={3}
              />
            </div>
            <div>
              <Label>Email para Notificação</Label>
              <Input 
                value={localData.notificationEmail || ''} 
                onChange={(e) => handleChange('notificationEmail', e.target.value)}
                placeholder="agente@exemplo.com"
              />
            </div>
          </>
        );
      
      default:
        return (
          <div className="p-4 text-center text-gray-500">
            Nenhuma propriedade disponível para este tipo de nó
          </div>
        );
    }
  };
  
  // Render action buttons based on node type
  const renderAddButtons = () => {
    const actions = [];
    
    // Add message options
    if (['startTrigger', 'textMessage', 'quickReplies', 'condition', 'waitResponse', 'delay', 'setVariable'].includes(node.type)) {
      actions.push(
        <Button key="message" variant="outline" className="flex items-center gap-2" onClick={() => {}}>
          <MessageCircle className="h-4 w-4" />
          <span>Adicionar Mensagem</span>
        </Button>
      );
    }
    
    // Add condition option
    if (['startTrigger', 'textMessage', 'quickReplies', 'waitResponse'].includes(node.type)) {
      actions.push(
        <Button key="condition" variant="outline" className="flex items-center gap-2" onClick={() => {}}>
          <ArrowRight className="h-4 w-4" />
          <span>Adicionar Condição</span>
        </Button>
      );
    }
    
    return (
      <div className="flex flex-col gap-2 mt-4">
        {actions}
        <Button onClick={onAddBlock} variant="default" className="mt-2">
          <Plus className="h-4 w-4 mr-2" /> Adicionar Bloco
        </Button>
      </div>
    );
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="absolute top-2 right-2 h-6 w-6 p-0">
          <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.625 2.5C8.625 3.12132 8.12132 3.625 7.5 3.625C6.87868 3.625 6.375 3.12132 6.375 2.5C6.375 1.87868 6.87868 1.375 7.5 1.375C8.12132 1.375 8.625 1.87868 8.625 2.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM7.5 13.625C8.12132 13.625 8.625 13.1213 8.625 12.5C8.625 11.8787 8.12132 11.375 7.5 11.375C6.87868 11.375 6.375 11.8787 6.375 12.5C6.375 13.1213 6.87868 13.625 7.5 13.625Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{nodeType?.label || 'Nó'}</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label>Nome do Nó</Label>
            <Input 
              value={localData.name || ''} 
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nome do nó"
            />
          </div>
          <div>
            <Label>Descrição</Label>
            <Input 
              value={localData.description || ''} 
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descrição opcional"
            />
          </div>
          
          <div className="space-y-4">
            {renderFields()}
          </div>
          
          {renderAddButtons()}
          
          <div className="flex justify-end mt-4">
            <Button onClick={handleApplyChanges}>
              Salvar Alterações
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}