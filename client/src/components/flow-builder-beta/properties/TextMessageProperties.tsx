
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TextMessagePropertiesProps {
  data: any;
  onChange: (data: any) => void;
}

const TextMessageProperties: React.FC<TextMessagePropertiesProps> = ({ data, onChange }) => {
  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...data,
      message: event.target.value,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="message">Mensagem</Label>
        <Textarea
          id="message"
          value={data?.message || ''}
          onChange={handleMessageChange}
          placeholder="Digite a mensagem de texto aqui..."
          className="mt-2"
          rows={5}
        />
      </div>
    </div>
  );
};

export default TextMessageProperties;
import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TextMessagePropertiesProps {
  node: Node;
  updateNodeData: (nodeId: string, data: any) => void;
}

const TextMessageProperties: React.FC<TextMessagePropertiesProps> = ({ 
  node, 
  updateNodeData 
}) => {
  const [text, setText] = useState(node.data?.text || '');
  const [waitForResponse, setWaitForResponse] = useState(node.data?.waitForResponse || false);
  
  useEffect(() => {
    if (node.data) {
      setText(node.data.text || '');
      setWaitForResponse(node.data.waitForResponse || false);
    }
  }, [node.data]);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    updateNodeData(node.id, { ...node.data, text: e.target.value });
  };
  
  const handleWaitChange = (checked: boolean) => {
    setWaitForResponse(checked);
    updateNodeData(node.id, { ...node.data, waitForResponse: checked });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Mensagem de Texto</label>
        <Textarea
          value={text}
          onChange={handleTextChange}
          className="min-h-[120px] w-full"
          placeholder="Digite sua mensagem..."
        />
        <p className="text-xs text-muted-foreground mt-1">
          Você pode usar variáveis com {{nome_da_variavel}}
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="wait-response">Aguardar resposta</Label>
          <p className="text-xs text-muted-foreground">
            O fluxo prossegue apenas após o usuário responder
          </p>
        </div>
        <Switch
          id="wait-response"
          checked={waitForResponse}
          onCheckedChange={handleWaitChange}
        />
      </div>
    </div>
  );
};

export default TextMessageProperties;
