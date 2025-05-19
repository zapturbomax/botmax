import TextMessageNodeV2 from './TextMessageNodeV2';
import BaseNodeV2 from './BaseNodeV2';

// Exporta todos os componentes de nós V2 com o novo design
export const modernNodesV2 = {
  textMessage: TextMessageNodeV2,
  // Os outros tipos de nós serão implementados seguindo o mesmo padrão
};

// Mapeamento entre tipos de nós e componentes modernos V2
export const nodeTypeToModernV2 = {
  'textMessage': 'textMessage',
  'mediaMessage': 'mediaMessage',
  'audioMessage': 'audioMessage',
  'quickReplies': 'quickReplies',
  'waitResponse': 'waitResponse',
  'contactMessage': 'contactMessage'
};

// Verifica se um tipo de nó tem uma versão moderna V2 correspondente
export const hasModernV2Version = (nodeType) => {
  return modernNodesV2[nodeTypeToModernV2[nodeType]] !== undefined;
};

// Retorna o tipo de nó moderno V2 correspondente
export const getModernV2NodeType = (nodeType) => {
  return nodeTypeToModernV2[nodeType] || nodeType;
};

export default modernNodesV2;