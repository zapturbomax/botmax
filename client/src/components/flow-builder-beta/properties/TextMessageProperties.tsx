
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
