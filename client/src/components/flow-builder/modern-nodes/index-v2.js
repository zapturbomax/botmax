import TextMessageNodeV2 from './TextMessageNodeV2';
import BaseNodeV2 from './BaseNodeV2';

// Exporta todos os componentes de nós V2 com o novo design do dispara.ai
export const modernNodesV2 = {
  textMessageV2: TextMessageNodeV2,
  // Os outros tipos de nós serão implementados seguindo o mesmo padrão
};

// Mapeamento entre tipos de nós e componentes modernos V2
export const nodeTypeToModernV2 = {
  'textMessage': 'textMessageV2',
  'mediaMessage': 'mediaMessageV2',
  'audioMessage': 'audioMessageV2',
  'quickReplies': 'quickRepliesV2',
  'waitResponse': 'waitResponseV2',
  'contactMessage': 'contactMessageV2'
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