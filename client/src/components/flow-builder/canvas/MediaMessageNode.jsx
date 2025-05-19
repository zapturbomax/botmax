import React, { useState } from 'react';
import { Image, Upload, X } from 'lucide-react';
import FlowNode from './FlowNode';

const MediaMessageNode = ({ id, data, selected }) => {
  // Estado para o tipo de mídia selecionado
  const [mediaType, setMediaType] = useState(data.mediaType || "image");
  const [caption, setCaption] = useState(data.caption || "");
  const [mediaUrl, setMediaUrl] = useState(data.mediaUrl || "");
  
  // Simula o upload de uma imagem
  const handleUpload = (e) => {
    // Em uma implementação real, aqui você faria o upload para o servidor
    // e obteria a URL da mídia para armazenar no estado
    
    const file = e.target.files[0];
    if (file) {
      // Simula uma URL para a imagem carregada
      const tempUrl = URL.createObjectURL(file);
      setMediaUrl(tempUrl);
    }
  };
  
  // Remove a mídia selecionada
  const handleRemoveMedia = () => {
    setMediaUrl("");
  };
  
  return (
    <FlowNode
      id={id}
      data={data}
      selected={selected}
      icon={<Image className="h-6 w-6" />}
      title="Enviar mídia"
      subtitle="Imagem/Vídeo/Arquivo"
      color="#4C6EF5"
    >
      {/* Seletor de tipo de mídia */}
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-2">
          <button 
            className={`py-2 px-3 text-xs font-medium rounded-lg ${mediaType === 'image' ? 'bg-[#4C6EF5] text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setMediaType('image')}
          >
            Imagem
          </button>
          <button 
            className={`py-2 px-3 text-xs font-medium rounded-lg ${mediaType === 'video' ? 'bg-[#4C6EF5] text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setMediaType('video')}
          >
            Vídeo
          </button>
          <button 
            className={`py-2 px-3 text-xs font-medium rounded-lg ${mediaType === 'document' ? 'bg-[#4C6EF5] text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setMediaType('document')}
          >
            Documento
          </button>
        </div>
      </div>
      
      {/* Upload de mídia */}
      {!mediaUrl ? (
        <div className="mb-4">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Clique para enviar</span> ou arraste e solte
              </p>
              <p className="text-xs text-gray-500">
                {mediaType === 'image' && 'JPG, PNG ou GIF (Máx. 10MB)'}
                {mediaType === 'video' && 'MP4, MOV (Máx. 16MB)'}
                {mediaType === 'document' && 'PDF, DOCX, XLSX (Máx. 5MB)'}
              </p>
            </div>
            <input 
              type="file" 
              className="hidden"
              accept={
                mediaType === 'image' ? 'image/*' : 
                mediaType === 'video' ? 'video/*' : 
                '.pdf,.doc,.docx,.xls,.xlsx'
              }
              onChange={handleUpload}
            />
          </label>
        </div>
      ) : (
        <div className="mb-4">
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            {mediaType === 'image' && (
              <img 
                src={mediaUrl} 
                alt="Imagem carregada" 
                className="w-full h-auto max-h-[200px] object-cover bg-gray-100"
              />
            )}
            {mediaType === 'video' && (
              <video 
                src={mediaUrl}
                controls
                className="w-full h-auto max-h-[200px] bg-gray-100"
              />
            )}
            {mediaType === 'document' && (
              <div className="flex items-center justify-center h-[100px] bg-gray-100 text-gray-500">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-1">Documento</p>
                </div>
              </div>
            )}
            <button 
              onClick={handleRemoveMedia}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50"
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
      )}
      
      {/* Legenda */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Legenda (opcional)</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-lg p-3 h-20 bg-gray-50 border-0 text-gray-800 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
          placeholder="Adicione uma legenda..."
        />
      </div>
      
      {/* Variáveis */}
      <div className="mt-4">
        <details className="group">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
            <span className="text-sm text-gray-600">Opções avançadas</span>
            <span className="transition group-open:rotate-180">
              <svg fill="none" height="14" width="14" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </summary>
          <div className="mt-3 text-sm text-gray-500 group-open:animate-fadeIn">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da variável para resposta</label>
              <input
                type="text"
                className="w-full p-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="resposta_media"
              />
            </div>
          </div>
        </details>
      </div>
    </FlowNode>
  );
};

export default MediaMessageNode;