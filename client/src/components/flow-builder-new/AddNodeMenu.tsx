import React from 'react';
import { MessageCircle, Image, List, MessageSquare, FileText, Music, Globe, Cable, User, Clock, ArrowRightLeft, AlertTriangle, X } from 'lucide-react';

interface AddNodeMenuProps {
  position: { x: number; y: number };
  onSelectNodeType: (nodeType: string) => void;
  onClose: () => void;
}

/**
 * Menu de adição de nós que aparece ao conectar blocos
 * Design baseado nas imagens de referência do Dispara.ai
 */
const AddNodeMenu = ({ position, onSelectNodeType, onClose }: AddNodeMenuProps) => {
  // Posicionamento do menu 
  const menuStyle = {
    position: 'absolute' as const,
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
  };

  return (
    <div 
      style={menuStyle} 
      className="bg-white shadow-lg rounded-lg border border-gray-200 w-[380px] max-h-[500px] overflow-auto"
    >
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="text-sm font-medium">O que você quer adicionar?</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4">
        {/* Seção de Mensagens */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500 mb-2">Mensagens</h4>
          <div className="grid grid-cols-3 gap-2">
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#26C6B9] cursor-pointer"
              onClick={() => onSelectNodeType('textMessage')}
            >
              <div className="h-8 w-8 rounded-full bg-[#26C6B9] text-white flex items-center justify-center mb-2">
                <MessageCircle className="h-4 w-4" />
              </div>
              <span className="text-xs text-center">Texto</span>
            </div>
            
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#26C6B9] cursor-pointer"
              onClick={() => onSelectNodeType('listMessage')}
            >
              <div className="h-8 w-8 rounded-full bg-[#26C6B9] text-white flex items-center justify-center mb-2">
                <List className="h-4 w-4" />
              </div>
              <span className="text-xs text-center">Lista</span>
            </div>
            
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#26C6B9] cursor-pointer"
              onClick={() => onSelectNodeType('buttonMessage')}
            >
              <div className="h-8 w-8 rounded-full bg-[#26C6B9] text-white flex items-center justify-center mb-2">
                <MessageSquare className="h-4 w-4" />
              </div>
              <span className="text-xs text-center">Botões</span>
            </div>
          </div>
        </div>
        
        {/* Seção de Mídia */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500 mb-2">Mídia</h4>
          <div className="grid grid-cols-5 gap-2">
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#8A58DC] cursor-pointer"
              onClick={() => onSelectNodeType('imageMessage')}
            >
              <div className="h-8 w-8 rounded-full bg-[#8A58DC] text-white flex items-center justify-center mb-2">
                <Image className="h-4 w-4" />
              </div>
              <span className="text-xs text-center">Imagem</span>
            </div>
            
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#8A58DC] cursor-pointer"
              onClick={() => onSelectNodeType('stickerMessage')}
            >
              <div className="h-8 w-8 rounded-full bg-[#8A58DC] text-white flex items-center justify-center mb-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xs text-center">Sticker</span>
            </div>
            
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#8A58DC] cursor-pointer"
              onClick={() => onSelectNodeType('audioMessage')}
            >
              <div className="h-8 w-8 rounded-full bg-[#8A58DC] text-white flex items-center justify-center mb-2">
                <Music className="h-4 w-4" />
              </div>
              <span className="text-xs text-center">Áudio</span>
            </div>
            
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#8A58DC] cursor-pointer"
              onClick={() => onSelectNodeType('documentMessage')}
            >
              <div className="h-8 w-8 rounded-full bg-[#8A58DC] text-white flex items-center justify-center mb-2">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-xs text-center">Documento</span>
            </div>
          </div>
        </div>
        
        {/* Seção de Modelos */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500 mb-2">Modelos</h4>
          <div className="grid grid-cols-3 gap-2">
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#2D7FF9] cursor-pointer"
              onClick={() => onSelectNodeType('formModel')}
            >
              <div className="h-8 w-8 rounded-full bg-[#2D7FF9] text-white flex items-center justify-center mb-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-xs text-center">Criar Formulário</span>
            </div>
            
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#2D7FF9] cursor-pointer"
              onClick={() => onSelectNodeType('cepModel')}
            >
              <div className="h-8 w-8 rounded-full bg-[#2D7FF9] text-white flex items-center justify-center mb-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 10C20 14.4183 12 22 12 22C12 22 4 14.4183 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11C12.5523 11 13 10.5523 13 10C13 9.44772 12.5523 9 12 9C11.4477 9 11 9.44772 11 10C11 10.5523 11.4477 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xs text-center">Captar o CEP</span>
            </div>
            
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#2D7FF9] cursor-pointer"
              onClick={() => onSelectNodeType('qrcodeModel')}
            >
              <div className="h-8 w-8 rounded-full bg-[#2D7FF9] text-white flex items-center justify-center mb-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 9V6C2 3.79086 3.79086 2 6 2H9M9 22H6C3.79086 22 2 20.2091 2 18V15M15 2H18C20.2091 2 22 3.79086 22 6V9M22 15V18C22 20.2091 20.2091 22 18 22H15M7 12C7 12 9.5 9 12 9C14.5 9 17 12 17 12C17 12 14.5 15 12 15C9.5 15 7 12 7 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12C12 12 12 12 12 12C12 12 12 12 12 12C12 12 12 12 12 12C12 12 12 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xs text-center">QRCode</span>
            </div>
          </div>
        </div>
        
        {/* Seção de Integrações */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500 mb-2">Integrações</h4>
          <div className="grid grid-cols-3 gap-2">
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#64B5F6] cursor-pointer"
              onClick={() => onSelectNodeType('chatbotNeoIntegration')}
            >
              <div className="h-8 w-8 rounded-full bg-[#64B5F6] text-white flex items-center justify-center mb-2">
                <MessageSquare className="h-4 w-4" />
              </div>
              <span className="text-xs text-center">Chatbot Neo</span>
            </div>
            
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#64B5F6] cursor-pointer"
              onClick={() => onSelectNodeType('apiIntegration')}
            >
              <div className="h-8 w-8 rounded-full bg-[#64B5F6] text-white flex items-center justify-center mb-2">
                <Globe className="h-4 w-4" />
              </div>
              <span className="text-xs text-center">Integração HTTP</span>
            </div>
            
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#64B5F6] cursor-pointer"
              onClick={() => onSelectNodeType('chatGptIntegration')}
            >
              <div className="h-8 w-8 rounded-full bg-[#64B5F6] text-white flex items-center justify-center mb-2">
                <Cable className="h-4 w-4" />
              </div>
              <span className="text-xs text-center">Chat GPT</span>
            </div>
          </div>
        </div>
        
        {/* Seção de Ações */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500 mb-2">Ações</h4>
          <div className="grid grid-cols-4 gap-2">
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#FFB74D] cursor-pointer"
              onClick={() => onSelectNodeType('waitAction')}
            >
              <div className="h-8 w-8 rounded-full bg-[#FFB74D] text-white flex items-center justify-center mb-2">
                <Clock className="h-4 w-4" />
              </div>
              <span className="text-xs text-center">Limitar execução</span>
            </div>
            
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#FFB74D] cursor-pointer"
              onClick={() => onSelectNodeType('createRuleAction')}
            >
              <div className="h-8 w-8 rounded-full bg-[#FFB74D] text-white flex items-center justify-center mb-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 3C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 7L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 12L17 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 17L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xs text-center">Criar regra</span>
            </div>
            
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#FFB74D] cursor-pointer"
              onClick={() => onSelectNodeType('integrationAction')}
            >
              <div className="h-8 w-8 rounded-full bg-[#FFB74D] text-white flex items-center justify-center mb-2">
                <Globe className="h-4 w-4" />
              </div>
              <span className="text-xs text-center">Integração</span>
            </div>
            
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#FFB74D] cursor-pointer"
              onClick={() => onSelectNodeType('conditionAction')}
            >
              <div className="h-8 w-8 rounded-full bg-[#FFB74D] text-white flex items-center justify-center mb-2">
                <ArrowRightLeft className="h-4 w-4" />
              </div>
              <span className="text-xs text-center">Condição</span>
            </div>
            
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#FFB74D] cursor-pointer"
              onClick={() => onSelectNodeType('multiConditionAction')}
            >
              <div className="h-8 w-8 rounded-full bg-[#FFB74D] text-white flex items-center justify-center mb-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xs text-center">Multi-condição</span>
            </div>
            
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#FFB74D] cursor-pointer"
              onClick={() => onSelectNodeType('transferAction')}
            >
              <div className="h-8 w-8 rounded-full bg-[#FFB74D] text-white flex items-center justify-center mb-2">
                <User className="h-4 w-4" />
              </div>
              <span className="text-xs text-center">Transferir</span>
            </div>
            
            <div 
              className="flex flex-col items-center p-3 rounded-md border border-gray-200 hover:border-[#FFB74D] cursor-pointer"
              onClick={() => onSelectNodeType('terminateAction')}
            >
              <div className="h-8 w-8 rounded-full bg-[#FFB74D] text-white flex items-center justify-center mb-2">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <span className="text-xs text-center">Finalizar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNodeMenu;