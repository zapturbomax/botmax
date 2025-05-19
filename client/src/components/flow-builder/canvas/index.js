import FlowNode from './FlowNode';
import TextMessageNode from './TextMessageNode';
import MediaMessageNode from './MediaMessageNode';
import ButtonsNode from './ButtonsNode';
import WaitResponseNode from './WaitResponseNode';

// Mapeamento de tipos de nós para seus componentes
export const canvasNodes = {
  textMessageCanvas: TextMessageNode,
  mediaMessageCanvas: MediaMessageNode,
  buttonsCanvas: ButtonsNode,
  waitResponseCanvas: WaitResponseNode,
};

// Mapeamento entre tipos de nós padrão e componentes canvas
export const nodeTypeToCanvas = {
  'textMessage': 'textMessageCanvas',
  'mediaMessage': 'mediaMessageCanvas',
  'quickReplies': 'buttonsCanvas',
  'waitResponse': 'waitResponseCanvas',
};

// Verifica se um tipo de nó tem uma versão canvas correspondente
export const hasCanvasVersion = (nodeType) => {
  return canvasNodes[nodeTypeToCanvas[nodeType]] !== undefined;
};

// Retorna o tipo de nó canvas correspondente
export const getCanvasNodeType = (nodeType) => {
  return nodeTypeToCanvas[nodeType] || nodeType;
};

export default canvasNodes;