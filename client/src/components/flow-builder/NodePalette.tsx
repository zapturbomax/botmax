import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { nodeTypes } from './FlowNodeTypes';
import { useFlowBuilder } from '@/hooks/use-flow-builder';

const NodeCategory = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h4>
    <div className="mt-2 space-y-2">
      {children}
    </div>
  </div>
);

const NodePalette = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { onDragStart } = useFlowBuilder();
  
  // Group nodes by category
  const nodesByCategory = nodeTypes.reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = [];
    }
    acc[node.category].push(node);
    return acc;
  }, {} as Record<string, typeof nodeTypes>);
  
  // Filter nodes by search term
  const filteredNodesByCategory = Object.keys(nodesByCategory).reduce((acc, category) => {
    const filteredNodes = nodesByCategory[category].filter(node => 
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredNodes.length > 0) {
      acc[category] = filteredNodes;
    }
    
    return acc;
  }, {} as Record<string, typeof nodeTypes>);
  
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Node Types</h3>
        <div className="mt-1">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 text-sm" 
              placeholder="Search nodes..." 
            />
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
        {Object.keys(filteredNodesByCategory).map((category) => (
          <NodeCategory key={category} title={category}>
            {filteredNodesByCategory[category].map((nodeType) => (
              <div
                key={nodeType.type}
                className="flow-node flex items-center p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650"
                draggable
                onDragStart={(event) => onDragStart(event, nodeType.type)}
              >
                <div className={`flex-shrink-0 w-8 h-8 ${nodeType.color} rounded-md flex items-center justify-center`}>
                  {nodeType.icon}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{nodeType.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{nodeType.description}</p>
                </div>
              </div>
            ))}
          </NodeCategory>
        ))}
      </div>
    </div>
  );
};

export default NodePalette;
