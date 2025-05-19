
import React from 'react';
import { NodeTypes } from 'reactflow';

// Placeholder para os componentes reais de nós
const TextMessageNode = () => <div>Text Message Node</div>;
const ButtonsNode = () => <div>Buttons Node</div>;
const ConditionNode = () => <div>Condition Node</div>;

export const nodeTypes: NodeTypes = {
  textMessage: TextMessageNode,
  buttons: ButtonsNode,
  condition: ConditionNode,
};
