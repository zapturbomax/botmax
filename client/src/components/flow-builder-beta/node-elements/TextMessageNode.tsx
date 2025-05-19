
import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type TextMessageData = {
  content: string;
  delay: number;
  formatting: {
    bold: boolean;
    italic: boolean;
    monospace: boolean;
  };
};

const TextMessageNode: React.FC<NodeProps<TextMessageData>> = ({ 
  data, 
  selected, 
  id 
}) => {
  const [content, setContent] = useState(data.content || 'Digite sua mensagem aqui...');
  
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Aqui você adicionaria a lógica para atualizar o nó no estado global
  }, []);

  const characterCount = content.length;
  const isOverLimit = characterCount > 1024;

  return (
    <Card className={cn(
      "w-[280px] shadow-md transition-all", 
      selected ? "ring-2 ring-primary" : "",
      isOverLimit ? "ring-2 ring-destructive" : ""
    )}>
      <CardHeader className="bg-blue-500 text-white p-3 flex flex-row items-center space-x-2">
        <MessageCircle size={18} />
        <CardTitle className="text-sm font-medium">Mensagem de Texto</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <Textarea
          value={content}
          onChange={handleContentChange}
          className="min-h-[80px] text-sm resize-none"
          placeholder="Digite sua mensagem aqui..."
        />
        <div className="flex justify-between items-center mt-2 text-xs">
          <Badge variant={isOverLimit ? "destructive" : "secondary"}>
            {characterCount}/1024
          </Badge>
          <span className="text-muted-foreground">Delay: {data.delay || 0}s</span>
        </div>
      </CardContent>
      
      {/* Handle de entrada - só pode ter uma conexão de entrada */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500"
      />
      
      {/* Handle de saída - só pode ter uma conexão de saída */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500"
      />
    </Card>
  );
};

export default TextMessageNode;
