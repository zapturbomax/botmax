
import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle } from 'lucide-react';

interface ConditionPropertiesProps {
  node: Node;
  updateNodeData: (nodeId: string, data: any) => void;
  availableNodes: Node[];
}

const ConditionProperties: React.FC<ConditionPropertiesProps> = ({ 
  node, 
  updateNodeData,
  availableNodes
}) => {
  const [variable, setVariable] = useState(node.data.variable || '');
  const [operator, setOperator] = useState(node.data.operator || 'equals');
  const [value, setValue] = useState(node.data.value || '');
  const [trueTargetId, setTrueTargetId] = useState(node.data.trueTargetId || null);
  const [falseTargetId, setFalseTargetId] = useState(node.data.falseTargetId || null);

  // Atualizar estado local quando o nó mudar
  useEffect(() => {
    setVariable(node.data.variable || '');
    setOperator(node.data.operator || 'equals');
    setValue(node.data.value || '');
    setTrueTargetId(node.data.trueTargetId || null);
    setFalseTargetId(node.data.falseTargetId || null);
  }, [node.id, node.data]);
  
  // Atualizar dados do nó quando qualquer valor mudar
  const updateNodeDataField = (field: string, newValue: any) => {
    updateNodeData(node.id, { [field]: newValue });
  };
  
  const handleVariableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setVariable(newValue);
    updateNodeDataField('variable', newValue);
  };
  
  const handleOperatorChange = (newValue: string) => {
    setOperator(newValue);
    updateNodeDataField('operator', newValue);
  };
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    updateNodeDataField('value', newValue);
  };
  
  const handleTrueTargetChange = (newValue: string | null) => {
    setTrueTargetId(newValue);
    updateNodeDataField('trueTargetId', newValue);
  };
  
  const handleFalseTargetChange = (newValue: string | null) => {
    setFalseTargetId(newValue);
    updateNodeDataField('falseTargetId', newValue);
  };

  const isConfigured = variable && value && (trueTargetId || falseTargetId);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-1">Condição</label>
        {!isConfigured && (
          <Alert variant="default" className="bg-muted/50 mb-3">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Configure a condição completa e pelo menos um caminho
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium block mb-1">Variável</label>
            <Input
              value={variable}
              onChange={handleVariableChange}
              placeholder="Nome da variável"
              className="h-8 text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ex: nome, email, telefone, etc
            </p>
          </div>
          
          <div>
            <label className="text-xs font-medium block mb-1">Operador</label>
            <Select
              value={operator}
              onValueChange={handleOperatorChange}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">É igual a</SelectItem>
                <SelectItem value="not_equals">Não é igual a</SelectItem>
                <SelectItem value="contains">Contém</SelectItem>
                <SelectItem value="not_contains">Não contém</SelectItem>
                <SelectItem value="starts_with">Começa com</SelectItem>
                <SelectItem value="ends_with">Termina com</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-xs font-medium block mb-1">Valor</label>
            <Input
              value={value}
              onChange={handleValueChange}
              placeholder="Valor para comparação"
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <label className="text-sm font-medium block mb-2">Caminhos</label>
        
        <div className="space-y-3">
          <div>
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <label className="text-xs font-medium">Se for verdadeiro</label>
            </div>
            <Select
              value={trueTargetId || ''}
              onValueChange={(value) => handleTrueTargetChange(value || null)}
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
          
          <div>
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <label className="text-xs font-medium">Se for falso</label>
            </div>
            <Select
              value={falseTargetId || ''}
              onValueChange={(value) => handleFalseTargetChange(value || null)}
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
      </div>
    </div>
  );
};

export default ConditionProperties;
