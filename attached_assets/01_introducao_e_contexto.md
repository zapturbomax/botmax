# Prompt 1: Introdução e Contexto para Implementação do Flow Builder

## Contexto e Objetivo

Implementar um Flow Builder completo para ChatBot WhatsApp, idêntico ao do dispara.ai, com layout em tela cheia, todos os tipos de blocos, sistema de conexões, painel de propriedades e funcionalidades avançadas.

## Tecnologias e Estrutura

O projeto usa:
- React com TypeScript
- Vite como bundler
- Tailwind CSS para estilização
- Shadcn/UI como sistema de componentes
- React Flow para o construtor visual
- React Hook Form para formulários
- TanStack Query para gerenciamento de estado

## Estrutura de Diretórios

Para implementar este Flow Builder, crie a seguinte estrutura de diretórios:

```
src/
├── components/
│   ├── flow-builder/
│   │   ├── node-elements/
│   │   │   ├── TextMessageNode.tsx
│   │   │   ├── ButtonsNode.tsx
│   │   │   └── ConditionNode.tsx
│   │   ├── properties/
│   │   │   ├── TextMessageProperties.tsx
│   │   │   ├── ButtonsProperties.tsx
│   │   │   └── ConditionProperties.tsx
│   │   ├── FlowBuilderLayout.tsx
│   │   ├── FlowCanvas.tsx
│   │   ├── NodePalette.tsx
│   │   ├── PropertiesPanel.tsx
│   │   └── FlowNodeTypes.tsx
│   └── ui/
│       └── ... (componentes UI do Shadcn)
├── hooks/
│   └── use-flow-store.ts
├── pages/
│   ├── FlowsPage.tsx
│   └── ... (outras páginas)
├── App.tsx
└── main.tsx
```

## Instruções de Implementação

Para implementar este Flow Builder no seu projeto Replit:

1. **Instale as dependências necessárias**:
   ```bash
   npm install reactflow zustand @radix-ui/react-tabs @radix-ui/react-toggle-group @radix-ui/react-tooltip
   ```

2. **Crie a estrutura de diretórios** conforme indicado acima.

3. **Copie e cole cada componente** nos arquivos correspondentes, seguindo a ordem dos prompts.

4. **Atualize as rotas** no arquivo App.tsx para incluir a rota do Flow Builder.

5. **Adicione os estilos necessários** no arquivo globals.css.

6. **Teste a implementação** acessando a rota do Flow Builder.

## Sequência de Implementação

Siga a ordem dos prompts para uma implementação incremental:

1. Introdução e Contexto (este arquivo)
2. Layout Principal em Tela Cheia (FlowBuilderLayout.tsx)
3. Canvas do Flow Builder (FlowCanvas.tsx)
4. Painel de Componentes (NodePalette.tsx)
5. Definição dos Tipos de Nós (FlowNodeTypes.tsx)
6. Implementação dos Nós Específicos (TextMessageNode.tsx, ButtonsNode.tsx, ConditionNode.tsx)
7. Painel de Propriedades (PropertiesPanel.tsx)
8. Componentes de Propriedades Específicas (TextMessageProperties.tsx, etc.)
9. Hook para Gerenciamento de Fluxos (use-flow-store.ts)
10. Atualização do App.tsx e Estilos Globais
