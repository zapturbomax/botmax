
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';

interface ButtonsPropertiesProps {
  data: any;
  onChange: (data: any) => void;
}

const ButtonsProperties: React.FC<ButtonsPropertiesProps> = ({ data, onChange }) => {
  const buttons = data?.buttons || [{ text: '' }, { text: '' }];

  const handleButtonTextChange = (index: number, text: string) => {
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], text };
    onChange({ ...data, buttons: newButtons });
  };

  const addButton = () => {
    onChange({ ...data, buttons: [...buttons, { text: '' }] });
  };

  const removeButton = (index: number) => {
    const newButtons = [...buttons];
    newButtons.splice(index, 1);
    onChange({ ...data, buttons: newButtons });
  };

  return (
    <div className="space-y-4">
      <Label>Botões</Label>
      
      <div className="space-y-2">
        {buttons.map((button, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={button.text}
              onChange={(e) => handleButtonTextChange(index, e.target.value)}
              placeholder={`Botão ${index + 1}`}
              className="flex-1"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => removeButton(index)}
              disabled={buttons.length <= 1}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={addButton}
        disabled={buttons.length >= 5}
        className="w-full mt-2"
      >
        <Plus className="h-4 w-4 mr-2" /> Adicionar Botão
      </Button>
    </div>
  );
};

export default ButtonsProperties;
import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ButtonsPropertiesProps {
  node: Node;
  updateNodeData: (nodeId: string, data: any) => void;
}

const ButtonsProperties: React.FC<ButtonsPropertiesProps> = ({ 
  node, 
  updateNodeData 
}) => {
  const [text, setText] = useState(node.data?.text || 'Selecione uma opção:');
  const [buttons, setButtons] = useState(
    node.data?.buttons || [{ label: 'Opção 1', targetNodeId: null }]
  );
  
  useEffect(() => {
    if (node.data) {
      setText(node.data.text || 'Selecione uma opção:');
      setButtons(node.data.buttons || [{ label: 'Opção 1', targetNodeId: null }]);
    }
  }, [node.data]);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    updateNodeData(node.id, { ...node.data, text: e.target.value });
  };
  
  const handleButtonChange = (index: number, value: string) => {
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], label: value };
    setButtons(newButtons);
    updateNodeData(node.id, { ...node.data, buttons: newButtons });
  };
  
  const addButton = () => {
    if (buttons.length >= 3) return;
    
    const newButtons = [...buttons, { label: `Opção ${buttons.length + 1}`, targetNodeId: null }];
    setButtons(newButtons);
    updateNodeData(node.id, { ...node.data, buttons: newButtons });
  };
  
  const removeButton = (index: number) => {
    if (buttons.length <= 1) return;
    
    const newButtons = buttons.filter((_, i) => i !== index);
    setButtons(newButtons);
    updateNodeData(node.id, { ...node.data, buttons: newButtons });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Texto da Mensagem</label>
        <Input
          value={text}
          onChange={handleTextChange}
          className="w-full"
          placeholder="Texto da mensagem"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Botões</label>
          <Badge variant="outline">{buttons.length}/3</Badge>
        </div>
        
        <div className="space-y-2">
          {buttons.map((button, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={button.label}
                onChange={(e) => handleButtonChange(index, e.target.value)}
                className="w-full"
                maxLength={20}
                placeholder={`Botão ${index + 1}`}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeButton(index)}
                disabled={buttons.length <= 1}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={addButton}
            disabled={buttons.length >= 3}
          >
            <Plus size={16} className="mr-1" /> Adicionar Botão
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            Máximo de 20 caracteres por botão
          </p>
        </div>
      </div>
    </div>
  );
};

export default ButtonsProperties;
