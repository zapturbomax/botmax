
import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { GitBranch, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type ConditionType = 'starts_with' | 'contains' | 'equals' | 'default';

type Condition = {
  type: ConditionType;
  value: string;
  targetNodeId: string | null;
};

type ConditionNodeData = {
  conditions: Condition[];
};

const ConditionNode: React.FC<NodeProps<ConditionNodeData>> = ({ 
  data, 
  selected, 
  id 
}) => {
  const [nodeData, setNodeData] = useState<ConditionNodeData>(data || { 
    conditions: [
      { type: 'contains', value: '', targetNodeId: null },
      { type: 'default', value: '', targetNodeId: null }
    ] 
  });
  
  const addCondition = () => {
    // Verificar se já existe uma condição default
    const hasDefault = nodeData.conditions.some(c => c.type === 'default');
    
    setNodeData(prev => ({
      ...prev,
      conditions: [
        ...prev.conditions.filter(c => c.type !== 'default'),
        { type: 'contains', value: '', targetNodeId: null },
        ...(hasDefault ? [prev.conditions.find(c => c.type === 'default')!] : [])
      ]
    }));
  };
  
  const removeCondition = (index: number) => {
    // Não permitir remover se for a condição default ou se só tiver uma condição
    if (nodeData.conditions[index].type === 'default' || nodeData.conditions.length <= 2) return;
    
    setNodeData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };
  
  const updateConditionType = (index: number, type: ConditionType) => {
    setNodeData(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) => 
        i === index ? { ...condition, type } : condition
      )
    }));
  };
  
  const updateConditionValue = (index: number, value: string) => {
    setNodeData(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) => 
        i === index ? { ...condition, value } : condition
      )
    }));
  };

  return (
    <Card className={cn(
      "w-[300px] shadow-md transition-all", 
      selected ? "ring-2 ring-primary" : ""
    )}>
      <CardHeader className="bg-green-500 text-white p-3 flex flex-row items-center space-x-2">
        <GitBranch size={18} />
        <CardTitle className="text-sm font-medium">Condições</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-3">
          {nodeData.conditions.map((condition, index) => (
            <div key={index} className="space-y-2 pb-2 border-b last:border-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  Condição {condition.type === 'default' ? 'Padrão' : index + 1}
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
                <div className="flex items-center space-x-2">
                  <Select 
                    value={condition.type} 
                    onValueChange={(value) => updateConditionType(index, value as ConditionType)}
                  >
                    <SelectTrigger className="w-[130px] text-xs">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starts_with">Começa com</SelectItem>
                      <SelectItem value="contains">Contém</SelectItem>
                      <SelectItem value="equals">Igual a</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    value={condition.value}
                    onChange={(e) => updateConditionValue(index, e.target.value)}
                    className="text-xs flex-1"
                    placeholder="Valor"
                    disabled={condition.type === 'default'}
                  />
                </div>
              )}
              
              {condition.type === 'default' && (
                <div className="text-xs text-muted-foreground italic">
                  Será executado se nenhuma condição acima for atendida
                </div>
              )}
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2" 
          onClick={addCondition}
        >
          <Plus size={16} className="mr-1" /> Adicionar Condição
        </Button>
      </CardContent>
      
      {/* Handle de entrada */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-green-500"
      />
      
      {/* Handles de saída - um para cada condição */}
      {nodeData.conditions.map((_, index) => (
        <Handle
          key={index}
          type="source"
          position={Position.Bottom}
          id={`condition-${index}`}
          className="w-3 h-3 bg-green-500"
          style={{ 
            left: `${(index + 1) * (100 / (nodeData.conditions.length + 1))}%` 
          }}
        />
      ))}
    </Card>
  );
};

export default ConditionNode;
