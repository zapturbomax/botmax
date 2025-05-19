
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
import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

type ConditionType = 'starts_with' | 'contains' | 'equals' | 'default';

interface ConditionPropertiesProps {
  node: Node;
  updateNodeData: (nodeId: string, data: any) => void;
}

const ConditionProperties: React.FC<ConditionPropertiesProps> = ({ 
  node, 
  updateNodeData 
}) => {
  const [conditions, setConditions] = useState(
    node.data?.conditions || [
      { type: 'contains', value: '', targetNodeId: null },
      { type: 'default', value: '', targetNodeId: null }
    ]
  );
  
  useEffect(() => {
    if (node.data) {
      setConditions(node.data.conditions || [
        { type: 'contains', value: '', targetNodeId: null },
        { type: 'default', value: '', targetNodeId: null }
      ]);
    }
  }, [node.data]);
  
  const updateConditionType = (index: number, type: ConditionType) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], type };
    setConditions(newConditions);
    updateNodeData(node.id, { ...node.data, conditions: newConditions });
  };
  
  const updateConditionValue = (index: number, value: string) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], value };
    setConditions(newConditions);
    updateNodeData(node.id, { ...node.data, conditions: newConditions });
  };
  
  const addCondition = () => {
    // Sempre manter a condição default por último
    const defaultCondition = conditions.find(c => c.type === 'default');
    const otherConditions = conditions.filter(c => c.type !== 'default');
    
    const newConditions = [
      ...otherConditions,
      { type: 'contains', value: '', targetNodeId: null },
      defaultCondition || { type: 'default', value: '', targetNodeId: null }
    ];
    
    setConditions(newConditions);
    updateNodeData(node.id, { ...node.data, conditions: newConditions });
  };
  
  const removeCondition = (index: number) => {
    if (conditions.length <= 2 || conditions[index].type === 'default') return;
    
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
    updateNodeData(node.id, { ...node.data, conditions: newConditions });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Condições</label>
        
        <div className="space-y-3">
          {conditions.map((condition, index) => (
            <div key={index} className="p-2 border rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">
                  {condition.type === 'default' ? 'Condição Padrão' : `Condição ${index + 1}`}
                </span>
                {condition.type !== 'default' && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeCondition(index)}
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
              
              {condition.type !== 'default' && (
                <>
                  <div className="mb-2">
                    <Select 
                      value={condition.type} 
                      onValueChange={(value) => updateConditionType(index, value as ConditionType)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tipo de condição" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starts_with">Começa com</SelectItem>
                        <SelectItem value="contains">Contém</SelectItem>
                        <SelectItem value="equals">Igual a</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Input
                    value={condition.value}
                    onChange={(e) => updateConditionValue(index, e.target.value)}
                    placeholder="Valor da condição"
                  />
                </>
              )}
              
              {condition.type === 'default' && (
                <div className="text-xs text-muted-foreground italic">
                  Esta condição será executada se nenhuma das condições acima for atendida.
                </div>
              )}
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-3" 
          onClick={addCondition}
        >
          <Plus size={16} className="mr-1" /> Adicionar Condição
        </Button>
      </div>
    </div>
  );
};

export default ConditionProperties;
