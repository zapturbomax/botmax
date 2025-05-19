
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ConditionPropertiesProps {
  data: any;
  onChange: (data: any) => void;
}

const ConditionProperties: React.FC<ConditionPropertiesProps> = ({ data, onChange }) => {
  const conditionTypes = [
    { value: 'variable', label: 'Variável' },
    { value: 'input', label: 'Entrada do Usuário' },
    { value: 'date', label: 'Data' },
  ];

  const handleTypeChange = (value: string) => {
    onChange({
      ...data,
      conditionType: value,
    });
  };

  const handleConditionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      condition: event.target.value,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="conditionType">Tipo de Condição</Label>
        <Select 
          value={data?.conditionType || 'variable'} 
          onValueChange={handleTypeChange}
        >
          <SelectTrigger id="conditionType" className="mt-2">
            <SelectValue placeholder="Selecione o tipo de condição" />
          </SelectTrigger>
          <SelectContent>
            {conditionTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="condition">Condição</Label>
        <Input
          id="condition"
          value={data?.condition || ''}
          onChange={handleConditionChange}
          placeholder="Ex: {{nome}} == 'João'"
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default ConditionProperties;
