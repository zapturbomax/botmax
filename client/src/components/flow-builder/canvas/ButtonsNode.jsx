import React, { useState } from 'react';
import FlowNode from './FlowNode';
import { MenuSquare, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Nó para envio de botões interativos
 */
const ButtonsNode = ({ id, data, selected }) => {
  const [headerText, setHeaderText] = useState(data.headerText || 'Selecione uma opção');
  const [buttons, setButtons] = useState(data.buttons || [
    { id: '1', text: 'Opção 1', value: 'opcao_1' },
    { id: '2', text: 'Opção 2', value: 'opcao_2' }
  ]);
  
  // Função para atualizar o texto do cabeçalho
  const handleHeaderTextChange = (e) => {
    const newText = e.target.value;
    setHeaderText(newText);
    
    if (data.onChange) {
      data.onChange(id, { ...data, headerText: newText });
    }
  };
  
  // Função para atualizar o texto de um botão
  const handleButtonTextChange = (buttonId, newText) => {
    const updatedButtons = buttons.map(button => 
      button.id === buttonId ? { ...button, text: newText } : button
    );
    
    setButtons(updatedButtons);
    
    if (data.onChange) {
      data.onChange(id, { ...data, buttons: updatedButtons });
    }
  };
  
  // Função para atualizar o valor de um botão
  const handleButtonValueChange = (buttonId, newValue) => {
    const updatedButtons = buttons.map(button => 
      button.id === buttonId ? { ...button, value: newValue } : button
    );
    
    setButtons(updatedButtons);
    
    if (data.onChange) {
      data.onChange(id, { ...data, buttons: updatedButtons });
    }
  };
  
  // Função para adicionar um novo botão
  const handleAddButton = () => {
    if (buttons.length >= 5) return; // Limite de 5 botões
    
    const newButton = {
      id: Date.now().toString(),
      text: `Opção ${buttons.length + 1}`,
      value: `opcao_${buttons.length + 1}`
    };
    
    const updatedButtons = [...buttons, newButton];
    setButtons(updatedButtons);
    
    if (data.onChange) {
      data.onChange(id, { ...data, buttons: updatedButtons });
    }
  };
  
  // Função para remover um botão
  const handleRemoveButton = (buttonId) => {
    if (buttons.length <= 1) return; // Pelo menos 1 botão
    
    const updatedButtons = buttons.filter(button => button.id !== buttonId);
    setButtons(updatedButtons);
    
    if (data.onChange) {
      data.onChange(id, { ...data, buttons: updatedButtons });
    }
  };

  return (
    <FlowNode 
      id={id}
      data={data}
      selected={selected}
      icon={MenuSquare}
      title="Botões"
      subtitle="Opções interativas"
      color="#7950f2"
      outputs={buttons.length} // Múltiplas saídas para cada botão
    >
      {/* Campo para o texto do cabeçalho */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Texto introdutório</label>
        <Input
          value={headerText}
          onChange={handleHeaderTextChange}
          placeholder="Insira o texto que aparecerá acima dos botões"
          className="w-full"
        />
      </div>
      
      {/* Lista de botões */}
      <div className="mb-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">Botões (max. 5)</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddButton}
            disabled={buttons.length >= 5}
            className="h-7 text-xs"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1" />
            Adicionar
          </Button>
        </div>
        
        <div className="space-y-3">
          {buttons.map((button, index) => (
            <div key={button.id} className="flex items-start space-x-2">
              <div className="flex-1">
                <Input
                  value={button.text}
                  onChange={(e) => handleButtonTextChange(button.id, e.target.value)}
                  placeholder={`Texto do botão ${index + 1}`}
                  className="w-full mb-1.5"
                  maxLength={20}
                />
                <Input
                  value={button.value}
                  onChange={(e) => handleButtonValueChange(button.id, e.target.value)}
                  placeholder={`Valor do botão ${index + 1}`}
                  className="w-full text-xs"
                />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleRemoveButton(button.id)}
                disabled={buttons.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Preview dos botões */}
      <div className="mt-5 space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Preview</h3>
        <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
          <p className="text-sm text-gray-600 mb-3">{headerText}</p>
          <div className="flex flex-col space-y-2">
            {buttons.map((button) => (
              <div 
                key={button.id} 
                className="bg-white border border-gray-200 rounded px-4 py-2 text-center text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 cursor-pointer"
              >
                {button.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </FlowNode>
  );
};

export default ButtonsNode;