import React, { useState } from 'react';
import { HelpCircle, Edit, ChevronDown, Clock, AlertCircle, Plus } from 'lucide-react';
import BaseFlowNode from './BaseFlowNode';

function QuestionNode({ id, data, selected, isConnectable }) {
  const [question, setQuestion] = useState(data.question || 'Qual seu nome?');
  const [isEditing, setIsEditing] = useState(false);
  
  // Função para alternar o modo de edição
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };
  
  // Função para atualizar a pergunta
  const handleQuestionChange = (e) => {
    const newQuestion = e.target.value;
    setQuestion(newQuestion);
    
    if (data.onChange) {
      data.onChange(id, { question: newQuestion });
    }
  };
  
  return (
    <BaseFlowNode
      id={id}
      data={data}
      selected={selected}
      icon={<HelpCircle size={20} className="text-white" />}
      title="Fazer uma pergunta"
      subtitle="Pergunta"
      color="#26C6B9" // Verde-água
      hideEncaminhada={true}
      outputs={2} // Um conector para resposta válida e outro para tratamento de erro
    >
      {/* Área da pergunta */}
      <div className="mb-4">
        {isEditing ? (
          <textarea
            value={question}
            onChange={handleQuestionChange}
            autoFocus
            className="w-full p-3 text-sm border border-[#26C6B9] rounded-md resize-none focus:outline-none"
            onBlur={toggleEditing}
          />
        ) : (
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
            <span className="text-sm">{question}</span>
            <button 
              onClick={toggleEditing}
              className="text-[#26C6B9] hover:bg-[#26C6B9]/10 p-1 rounded"
            >
              <Edit size={16} />
            </button>
          </div>
        )}
      </div>
      
      {/* Seletor de variável */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">Salvar resposta em:</span>
        <div className="relative">
          <button className="flex items-center bg-gray-100 px-3 py-1 rounded-md text-sm">
            Selecione
            <ChevronDown size={14} className="ml-2" />
          </button>
        </div>
      </div>
      
      {/* Opções adicionais */}
      <div className="mb-4">
        <div className="flex items-center p-3 border border-gray-200 rounded-md mb-2">
          <Clock size={16} className="text-gray-400 mr-2" />
          <span className="text-sm">Se não responder em</span>
          <select className="ml-2 text-sm bg-transparent border-none appearance-none focus:outline-none">
            <option>60</option>
            <option>120</option>
            <option>180</option>
          </select>
          <span className="text-sm ml-1 mr-1">segundos</span>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-md">
          <AlertCircle size={16} className="text-gray-400 mr-2" />
          <span className="text-sm">Caso a resposta seja inválida</span>
          <ChevronDown size={14} className="text-gray-400 ml-auto" />
        </div>
      </div>
      
      {/* Botão para adicionar condição */}
      <div className="flex justify-end">
        <button className="flex items-center text-[#26C6B9] text-sm font-medium">
          <Plus size={14} className="mr-1" />
          Adicionar condição
        </button>
      </div>
    </BaseFlowNode>
  );
}

export default QuestionNode;