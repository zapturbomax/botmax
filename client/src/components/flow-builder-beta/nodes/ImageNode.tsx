import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Image, Upload, X, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ImageNodeProps {
  id: string;
  data: {
    imageUrl?: string;
    caption?: string;
    onChange?: (id: string, data: any) => void;
  };
  selected: boolean;
}

/**
 * Nó de imagem/mídia
 * Permite enviar uma imagem para o usuário
 */
const ImageNode = ({ id, data, selected }: ImageNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(data.imageUrl || '');
  const [caption, setCaption] = useState(data.caption || '');

  const handleSave = () => {
    if (data.onChange) {
      data.onChange(id, { ...data, imageUrl, caption });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setImageUrl(data.imageUrl || '');
    setCaption(data.caption || '');
    setIsEditing(false);
  };

  return (
    <div 
      className={`relative rounded-lg border-2 p-4 shadow-sm w-[280px] bg-white dark:bg-gray-800 ${
        selected ? 'border-purple-500 ring-2 ring-purple-200 dark:ring-purple-800' : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white">
          <Image className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">Mensagem com Imagem</h3>
        </div>
        {!isEditing && (
          <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="mt-2 space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1">URL da Imagem</label>
            <Input 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Legenda (opcional)</label>
            <Input 
              value={caption} 
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Legenda da imagem"
              className="text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
            >
              Salvar
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-2 bg-gray-50 dark:bg-gray-900 rounded-md overflow-hidden">
          {imageUrl ? (
            <div className="space-y-2">
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={caption || "Imagem"}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/400x300?text=Imagem+Inválida';
                  }}
                />
              </div>
              {caption && (
                <div className="p-2 text-sm text-gray-600 dark:text-gray-300">
                  {caption}
                </div>
              )}
            </div>
          ) : (
            <div 
              className="p-4 flex flex-col items-center justify-center min-h-[100px] text-sm text-gray-400 cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              <Upload className="w-6 h-6 mb-2" />
              <span>Clique para adicionar uma imagem</span>
            </div>
          )}
        </div>
      )}

      {/* Entrada */}
      <Handle
        type="target"
        position={Position.Top}
        id="a"
        className="w-3 h-3 bg-purple-500 border-2 border-white top-[-7px]"
      />

      {/* Saída */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        className="w-3 h-3 bg-purple-500 border-2 border-white bottom-[-7px]"
      />
    </div>
  );
};

export default ImageNode;