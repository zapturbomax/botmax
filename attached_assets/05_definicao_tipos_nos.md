# Prompt 5: Definição dos Tipos de Nós (FlowNodeTypes.tsx)

Este arquivo define todos os tipos de nós disponíveis no Flow Builder, seus metadados e registra os componentes correspondentes.

```tsx
// src/components/flow-builder/FlowNodeTypes.tsx
import { NodeTypes } from 'reactflow';
import TextMessageNode from './node-elements/TextMessageNode';
import ButtonsNode from './node-elements/ButtonsNode';
import ListNode from './node-elements/ListNode';
import MediaNode from './node-elements/MediaNode';
import ConditionNode from './node-elements/ConditionNode';
import VariableNode from './node-elements/VariableNode';
import DelayNode from './node-elements/DelayNode';
import WebhookNode from './node-elements/WebhookNode';

// Defina os tipos de nós disponíveis
export const NODE_TYPES = {
  textMessage: 'textMessage',
  buttons: 'buttons',
  list: 'list',
  media: 'media',
  condition: 'condition',
  variable: 'variable',
  delay: 'delay',
  webhook: 'webhook',
};

// Registre os componentes para cada tipo de nó
export const nodeTypes: NodeTypes = {
  [NODE_TYPES.textMessage]: TextMessageNode,
  [NODE_TYPES.buttons]: ButtonsNode,
  [NODE_TYPES.list]: ListNode,
  [NODE_TYPES.media]: MediaNode,
  [NODE_TYPES.condition]: ConditionNode,
  [NODE_TYPES.variable]: VariableNode,
  [NODE_TYPES.delay]: DelayNode,
  [NODE_TYPES.webhook]: WebhookNode,
};

// Metadados para o painel de componentes
export const nodeMetadata = {
  [NODE_TYPES.textMessage]: {
    label: 'Mensagem de Texto',
    category: 'Mensagens',
    description: 'Envia uma mensagem de texto para o contato',
    icon: 'MessageCircle',
    color: 'blue'
  },
  [NODE_TYPES.buttons]: {
    label: 'Botões',
    category: 'Interação',
    description: 'Apresenta botões para o contato escolher',
    icon: 'MousePointerClick',
    color: 'blue'
  },
  [NODE_TYPES.list]: {
    label: 'Lista',
    category: 'Interação',
    description: 'Apresenta uma lista de opções para escolha',
    icon: 'List',
    color: 'blue'
  },
  [NODE_TYPES.media]: {
    label: 'Mídia',
    category: 'Mensagens',
    description: 'Envia imagem, áudio ou vídeo',
    icon: 'Image',
    color: 'purple'
  },
  [NODE_TYPES.condition]: {
    label: 'Condição',
    category: 'Lógica',
    description: 'Direciona o fluxo com base em condições',
    icon: 'GitBranch',
    color: 'green'
  },
  [NODE_TYPES.variable]: {
    label: 'Variável',
    category: 'Lógica',
    description: 'Define ou atualiza uma variável',
    icon: 'Variable',
    color: 'green'
  },
  [NODE_TYPES.delay]: {
    label: 'Delay',
    category: 'Controle',
    description: 'Adiciona um tempo de espera',
    icon: 'Clock',
    color: 'orange'
  },
  [NODE_TYPES.webhook]: {
    label: 'Webhook',
    category: 'Integração',
    description: 'Integra com sistemas externos',
    icon: 'Webhook',
    color: 'red'
  },
};
```

## Características Principais

1. **Tipos de Nós**: Define constantes para todos os tipos de nós disponíveis
2. **Registro de Componentes**: Mapeia cada tipo de nó para seu componente React correspondente
3. **Metadados**: Define informações como rótulo, categoria, descrição, ícone e cor para cada tipo de nó
4. **Organização por Categorias**: Os nós são organizados em categorias como Mensagens, Interação, Lógica, etc.

Este arquivo é central para o Flow Builder, pois define todos os tipos de blocos disponíveis e suas características. Para adicionar um novo tipo de bloco, você precisaria:

1. Adicionar uma nova entrada em `NODE_TYPES`
2. Criar o componente correspondente
3. Registrar o componente em `nodeTypes`
4. Adicionar os metadados em `nodeMetadata`
