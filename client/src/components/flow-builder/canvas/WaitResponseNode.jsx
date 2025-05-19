import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import FlowNode from './FlowNode';

const WaitResponseNode = ({ id, data, selected }) => {
  // Estado local para configurações do nó
  const [timeout, setTimeout] = useState(data.timeout || 60);
  const [variableName, setVariableName] = useState(data.variableName || "resposta");
  const [timeoutMessage, setTimeoutMessage] = useState(
    data.timeoutMessage || "Não recebemos sua resposta a tempo. Por favor, tente novamente."
  );
  
  return (
    <FlowNode
      id={id}
      data={data}
      selected={selected}
      icon={<Clock className="h-6 w-6" />}
      title="Aguardar resposta"
      subtitle="Interação com usuário"
      color="#FD7E14"
      outputs={2}
    >
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tempo limite (segundos)</label>
          <input
            type="number"
            value={timeout}
            onChange={(e) => setTimeout(Number(e.target.value))}
            min={10}
            max={86400}
            className="w-full p-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FD7E14]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome da variável</label>
          <input
            value={variableName}
            onChange={(e) => setVariableName(e.target.value)}
            className="w-full p-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FD7E14]/50"
            placeholder="resposta"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem de tempo esgotado</label>
        <textarea
          value={timeoutMessage}
          onChange={(e) => setTimeoutMessage(e.target.value)}
          className="w-full rounded-lg p-3 min-h-[80px] bg-gray-50 border-0 text-gray-800 focus:ring-2 focus:ring-[#FD7E14]/50 outline-none resize-none"
          placeholder="Digite a mensagem que será enviada quando o tempo limite for atingido..."
        />
      </div>
      
      <div className="mt-4 border-t border-gray-100 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Fluxo</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">1</div>
            <span>Resposta recebida → Continua o fluxo</span>
          </div>
          <div className="flex items-center">
            <div className="bg-red-100 text-red-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">2</div>
            <span>Tempo esgotado ({timeout}s) → Envia mensagem e finaliza</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <details className="group">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
            <span className="text-sm text-gray-600">Configurações avançadas</span>
            <span className="transition group-open:rotate-180">
              <svg fill="none" height="14" width="14" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </summary>
          <div className="mt-3 text-sm text-gray-500 group-open:animate-fadeIn">
            <div className="form-group mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipos de mensagem aceitos</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <input type="checkbox" defaultChecked id="accept-text" className="rounded text-[#FD7E14] focus:ring-[#FD7E14]" />
                  <label htmlFor="accept-text" className="ml-2">Texto</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" defaultChecked id="accept-image" className="rounded text-[#FD7E14] focus:ring-[#FD7E14]" />
                  <label htmlFor="accept-image" className="ml-2">Imagem</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="accept-audio" className="rounded text-[#FD7E14] focus:ring-[#FD7E14]" />
                  <label htmlFor="accept-audio" className="ml-2">Áudio</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="accept-file" className="rounded text-[#FD7E14] focus:ring-[#FD7E14]" />
                  <label htmlFor="accept-file" className="ml-2">Arquivo</label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Validação (opcional)</label>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <select className="w-full p-2 rounded-md border border-gray-200 text-sm">
                  <option value="">Sem validação</option>
                  <option value="email">Email</option>
                  <option value="phone">Telefone</option>
                  <option value="number">Número</option>
                  <option value="regex">Expressão regular</option>
                </select>
                <input
                  type="text"
                  placeholder="Padrão de validação..."
                  className="w-full p-2 rounded-md border border-gray-200 text-sm"
                  disabled
                />
              </div>
              <textarea
                placeholder="Mensagem de erro (exibida quando validação falha)..."
                className="w-full p-2 rounded-md border border-gray-200 text-sm h-16 resize-none"
                disabled
              />
            </div>
          </div>
        </details>
      </div>
    </FlowNode>
  );
};

export default WaitResponseNode;