import React, { useState } from 'react';
import FlowNode from './FlowNode';
import { Image, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Nó para envio de imagens e conteúdo de mídia
 */
const MediaMessageNode = ({ id, data, selected }) => {
  const [caption, setCaption] = useState(data.caption || '');
  const [mediaUrl, setMediaUrl] = useState(data.mediaUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  
  // Função para atualizar a legenda
  const handleCaptionChange = (e) => {
    const newCaption = e.target.value;
    setCaption(newCaption);
    
    if (data.onChange) {
      data.onChange(id, { ...data, caption: newCaption });
    }
  };
  
  // Simular upload de imagem
  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulação de upload - em um caso real, enviaríamos para um serviço de armazenamento
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      setIsUploading(false);
      
      if (data.onChange) {
        data.onChange(id, { ...data, mediaUrl: url, mediaType: 'image', mediaName: file.name });
      }
    }, 1500);
  };
  
  // Remover mídia
  const handleRemoveMedia = () => {
    setMediaUrl('');
    
    if (data.onChange) {
      data.onChange(id, { ...data, mediaUrl: '', mediaType: '', mediaName: '' });
    }
  };

  return (
    <FlowNode 
      id={id}
      data={data}
      selected={selected}
      icon={Image}
      title="Enviar mídia"
      subtitle="Imagem/Vídeo"
      color="#4c6ef5"
    >
      {/* Área de upload/preview */}
      <div className="mb-4">
        {!mediaUrl ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
            <Image className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm mb-4 text-center">
              Arraste e solte uma imagem aqui, ou clique para selecionar
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="relative"
              disabled={isUploading}
            >
              {isUploading ? 'Enviando...' : 'Selecionar arquivo'}
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                disabled={isUploading}
              />
            </Button>
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <div className="absolute top-2 right-2 z-10">
              <button 
                className="bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80"
                onClick={handleRemoveMedia}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img 
              src={mediaUrl} 
              alt="Media preview" 
              className="w-full h-auto max-h-[200px] object-contain bg-gray-100"
            />
          </div>
        )}
      </div>
      
      {/* Campo para legenda */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Legenda (opcional)</label>
        <textarea
          value={caption}
          onChange={handleCaptionChange}
          placeholder="Adicione uma legenda para sua mídia..."
          className="w-full rounded-lg p-3 h-20 bg-gray-50 border-0 text-gray-800 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
        />
      </div>
    </FlowNode>
  );
};

export default MediaMessageNode;