import TextMessageNode from './TextMessageNode';
import ImageNode from './ImageNode';
import AudioNode from './AudioNode';
import ButtonsNode from './ButtonsNode';
import QuestionNode from './QuestionNode';
import ContactNode from './ContactNode';

// Exporta todos os componentes de nós modernos
export const modernNodeComponents = {
  textMessage: TextMessageNode,
  mediaMessage: ImageNode,
  audioMessage: AudioNode,
  quickReplies: ButtonsNode,
  waitResponse: QuestionNode,
  contactMessage: ContactNode
};

// Mapeamento entre tipos de nós e seus componentes modernos
export const nodeTypeToModernComponent = {
  'textMessage': 'textMessage',
  'mediaMessage': 'mediaMessage',
  'audioMessage': 'audioMessage',
  'quickReplies': 'quickReplies',
  'waitResponse': 'waitResponse',
  'contactMessage': 'contactMessage'
};

// Verifica se um tipo de nó tem uma versão moderna correspondente
export const hasModernVersion = (nodeType) => {
  return nodeTypeToModernComponent[nodeType] !== undefined;
};

// Retorna o tipo de nó moderno correspondente
export const getModernNodeType = (nodeType) => {
  return nodeTypeToModernComponent[nodeType] || nodeType;
};

export default modernNodeComponents;