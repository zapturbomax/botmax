import React, { useState } from 'react';
import FlowNode from './FlowNode';
import { Clock, MessageCircle, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

/**
 * Nó para aguardar resposta do usuário
 * Design com foco em UX e clareza
 */
const WaitResponseNode = ({ id, data, selected }) => {
  const [timeout, setTimeout] = useState(data.timeout || 60);
  const [variableName, setVariableName] = useState(data.variableName || 'resposta');
  const [quickReplies, setQuickReplies] = useState(data.quickReplies || []);
  const [useQuickReplies, setUseQuickReplies] = useState(data.useQuickReplies || false);
  const [timeoutMessage, setTimeoutMessage] = useState(data.timeoutMessage || 'Não recebemos sua resposta a tempo.');
  
  // Função para atualizar o tempo limite
  const handleTimeoutChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 0) return;
    
    setTimeout(value);
    
    if (data.onChange) {
      data.onChange(id, { ...data, timeout: value });
    }
  };
  
  // Função para atualizar o nome da variável
  const handleVariableNameChange = (e) => {
    const value = e.target.value;
    setVariableName(value);
    
    if (data.onChange) {
      data.onChange(id, { ...data, variableName: value });
    }
  };
  
  // Função para ativar/desativar respostas rápidas
  const handleQuickRepliesToggle = (checked) => {
    setUseQuickReplies(checked);
    
    if (data.onChange) {
      data.onChange(id, { ...data, useQuickReplies: checked });
    }
  };
  
  // Função para atualizar a mensagem de timeout
  const handleTimeoutMessageChange = (e) => {
    const value = e.target.value;
    setTimeoutMessage(value);
    
    if (data.onChange) {
      data.onChange(id, { ...data, timeoutMessage: value });
    }
  };
  
  // Função para adicionar resposta rápida
  const handleAddQuickReply = () => {
    if (quickReplies.length >= 3) return; // Máximo de 3 respostas rápidas
    
    const newReply = {
      id: Date.now().toString(),
      text: `Opção ${quickReplies.length + 1}`
    };
    
    const updatedReplies = [...quickReplies, newReply];
    setQuickReplies(updatedReplies);
    
    if (data.onChange) {
      data.onChange(id, { ...data, quickReplies: updatedReplies });
    }
  };
  
  // Função para atualizar uma resposta rápida
  const handleUpdateQuickReply = (replyId, text) => {
    const updatedReplies = quickReplies.map(reply => 
      reply.id === replyId ? { ...reply, text } : reply
    );
    
    setQuickReplies(updatedReplies);
    
    if (data.onChange) {
      data.onChange(id, { ...data, quickReplies: updatedReplies });
    }
  };
  
  // Função para remover uma resposta rápida
  const handleRemoveQuickReply = (replyId) => {
    const updatedReplies = quickReplies.filter(reply => reply.id !== replyId);
    setQuickReplies(updatedReplies);
    
    if (data.onChange) {
      data.onChange(id, { ...data, quickReplies: updatedReplies });
    }
  };
  
  // Calcular número de saídas - 1 para resposta recebida, 1 para timeout, mais as respostas rápidas quando ativadas
  const outputsCount = useQuickReplies ? quickReplies.length + 1 : 2;

  return (
    <FlowNode 
      id={id}
      data={data}
      selected={selected}
      icon={Clock}
      title="Aguardar resposta"
      subtitle="Interação com usuário"
      color="#fd7e14"
      outputs={outputsCount} // Múltiplas saídas (recebida, timeout, opções)
    >
      {/* Configuração da espera */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tempo limite (segundos)</label>
          <Input
            type="number"
            value={timeout}
            onChange={handleTimeoutChange}
            min={0}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome da variável</label>
          <Input
            value={variableName}
            onChange={handleVariableNameChange}
            placeholder="Nome para armazenar a resposta"
            className="w-full"
          />
        </div>
      </div>
      
      {/* Mensagem de timeout */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem de tempo esgotado</label>
        <textarea
          value={timeoutMessage}
          onChange={handleTimeoutMessageChange}
          placeholder="Mensagem a ser enviada quando o tempo expirar"
          className="w-full rounded-lg p-3 min-h-[80px] bg-gray-50 border-0 text-gray-800 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
        />
      </div>
      
      {/* Opções de resposta rápida */}
      <div className="border-t border-gray-100 pt-4 mb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="quick-replies" 
              checked={useQuickReplies}
              onCheckedChange={handleQuickRepliesToggle}
            />
            <Label htmlFor="quick-replies" className="text-sm font-medium text-gray-700">
              Habilitar respostas rápidas
            </Label>
          </div>
          
          {useQuickReplies && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddQuickReply}
              disabled={quickReplies.length >= 3}
              className="h-7 text-xs"
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              Adicionar
            </Button>
          )}
        </div>
        
        {useQuickReplies && (
          <div className="space-y-2">
            {quickReplies.map(reply => (
              <div key={reply.id} className="flex items-center space-x-2">
                <Input
                  value={reply.text}
                  onChange={(e) => handleUpdateQuickReply(reply.id, e.target.value)}
                  placeholder="Texto da resposta rápida"
                  className="flex-1"
                  maxLength={20}
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemoveQuickReply(reply.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Visualização de fluxo */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Fluxo</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">1</div>
            <span>Resposta recebida → Continua o fluxo</span>
          </div>
          <div className="flex items-center">
            <div className="bg-red-100 text-red-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">2</div>
            <span>Tempo esgotado ({timeout}s) → Envia mensagem e finaliza</span>
          </div>
          
          {useQuickReplies && quickReplies.map((reply, index) => (
            <div key={reply.id} className="flex items-center">
              <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">{index + 3}</div>
              <span>Resposta rápida: "{reply.text}"</span>
            </div>
          ))}
        </div>
      </div>
    </FlowNode>
  );
};

export default WaitResponseNode;