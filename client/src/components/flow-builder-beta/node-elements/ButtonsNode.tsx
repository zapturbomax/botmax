
import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MousePointerClick as ButtonIcon, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ButtonData = {
  label: string;
  targetNodeId: string | null;
};

type ButtonsNodeData = {
  text: string;
  buttons: ButtonData[];
};

const ButtonsNode: React.FC<NodeProps<ButtonsNodeData>> = ({ 
  data, 
  selected, 
  id 
}) => {
  const [nodeData, setNodeData] = useState<ButtonsNodeData>(data || { 
    text: 'Selecione uma opção:', 
    buttons: [{ label: 'Opção 1', targetNodeId: null }] 
  });
  
  const addButton = () => {
    if (nodeData.buttons.length >= 3) return; // Máximo de 3 botões no WhatsApp
    
    setNodeData(prev => ({
      ...prev,
      buttons: [...prev.buttons, { label: `Opção ${prev.buttons.length + 1}`, targetNodeId: null }]
    }));
  };
  
  const removeButton = (index: number) => {
    if (nodeData.buttons.length <= 1) return; // Deve ter pelo menos 1 botão
    
    setNodeData(prev => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index)
    }));
  };
  
  const updateButtonLabel = (index: number, label: string) => {
    setNodeData(prev => ({
      ...prev,
      buttons: prev.buttons.map((btn, i) => 
        i === index ? { ...btn, label } : btn
      )
    }));
  };
  
  const updateText = (text: string) => {
    setNodeData(prev => ({ ...prev, text }));
  };

  return (
    <Card className={cn(
      "w-[280px] shadow-md transition-all", 
      selected ? "ring-2 ring-primary" : ""
    )}>
      <CardHeader className="bg-blue-400 text-white p-3 flex flex-row items-center space-x-2">
        <ButtonIcon size={18} />
        <CardTitle className="text-sm font-medium">Botões</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <Input
          value={nodeData.text}
          onChange={(e) => updateText(e.target.value)}
          className="mb-2 text-sm"
          placeholder="Texto da mensagem"
        />
        
        <div className="space-y-2 mt-3">
          {nodeData.buttons.map((button, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={button.label}
                onChange={(e) => updateButtonLabel(index, e.target.value)}
                className="text-sm flex-1"
                maxLength={20}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeButton(index)}
                disabled={nodeData.buttons.length <= 1}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2" 
          onClick={addButton}
          disabled={nodeData.buttons.length >= 3}
        >
          <Plus size={16} className="mr-1" /> Adicionar Botão
        </Button>
        
        <div className="mt-2 text-xs text-muted-foreground">
          <Badge variant="outline">{nodeData.buttons.length}/3 botões</Badge>
          <span className="ml-2">Máx. 20 caracteres por botão</span>
        </div>
      </CardContent>
      
      {/* Handle de entrada */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-400"
      />
      
      {/* Handles de saída - um para cada botão */}
      {nodeData.buttons.map((_, index) => (
        <Handle
          key={index}
          type="source"
          position={Position.Bottom}
          id={`button-${index}`}
          className="w-3 h-3 bg-blue-400"
          style={{ 
            left: `${25 + (index * 25)}%` 
          }}
        />
      ))}
    </Card>
  );
};

export default ButtonsNode;
