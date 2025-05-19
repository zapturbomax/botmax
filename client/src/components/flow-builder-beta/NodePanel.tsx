import React from 'react';
import { MessageCircle, Image, List, PhoneCall, CheckSquare, GitBranch, Clock, Globe, Variable, Users } from 'lucide-react';

/**
 * Painel lateral com os tipos de nós disponíveis para arrastar para o canvas
 */
const NodePanel = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium mb-4">Blocos</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Mensagens</h4>
          <div className="space-y-2">
            <div 
              className="flex items-center p-3 rounded-md bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab border border-gray-200 dark:border-gray-700"
              draggable
              onDragStart={(event) => onDragStart(event, 'textMessage')}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white mr-3">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-medium text-sm">Texto</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Envia uma mensagem de texto</p>
              </div>
            </div>

            <div 
              className="flex items-center p-3 rounded-md bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab border border-gray-200 dark:border-gray-700"
              draggable
              onDragStart={(event) => onDragStart(event, 'imageNode')}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white mr-3">
                <Image className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-medium text-sm">Imagem</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Envia uma imagem ou foto</p>
              </div>
            </div>

            <div 
              className="flex items-center p-3 rounded-md bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab border border-gray-200 dark:border-gray-700"
              draggable
              onDragStart={(event) => onDragStart(event, 'listMessage')}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 text-white mr-3">
                <List className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-medium text-sm">Lista</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Exibe uma lista de opções</p>
              </div>
            </div>

            <div 
              className="flex items-center p-3 rounded-md bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab border border-gray-200 dark:border-gray-700"
              draggable
              onDragStart={(event) => onDragStart(event, 'buttonMessage')}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500 text-white mr-3">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-medium text-sm">Botões</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Adiciona botões interativos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Lógica</h4>
          <div className="space-y-2">
            <div 
              className="flex items-center p-3 rounded-md bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab border border-gray-200 dark:border-gray-700"
              draggable
              onDragStart={(event) => onDragStart(event, 'conditionNode')}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-white mr-3">
                <GitBranch className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-medium text-sm">Condição</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Cria um desvio condicional</p>
              </div>
            </div>
           
            <div 
              className="flex items-center p-3 rounded-md bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab border border-gray-200 dark:border-gray-700"
              draggable
              onDragStart={(event) => onDragStart(event, 'delayNode')}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white mr-3">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-medium text-sm">Espera</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Aguarda um tempo determinado</p>
              </div>
            </div>

            <div 
              className="flex items-center p-3 rounded-md bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab border border-gray-200 dark:border-gray-700"
              draggable
              onDragStart={(event) => onDragStart(event, 'apiNode')}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white mr-3">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-medium text-sm">API</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Faz uma chamada para API externa</p>
              </div>
            </div>

            <div 
              className="flex items-center p-3 rounded-md bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab border border-gray-200 dark:border-gray-700"
              draggable
              onDragStart={(event) => onDragStart(event, 'variableNode')}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 text-white mr-3">
                <Variable className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-medium text-sm">Variável</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Define ou consulta variáveis</p>
              </div>
            </div>

            <div 
              className="flex items-center p-3 rounded-md bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab border border-gray-200 dark:border-gray-700"
              draggable
              onDragStart={(event) => onDragStart(event, 'humanNode')}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white mr-3">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-medium text-sm">Atendente</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Transfere para atendimento humano</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodePanel;