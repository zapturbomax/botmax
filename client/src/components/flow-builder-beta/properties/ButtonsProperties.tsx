
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
