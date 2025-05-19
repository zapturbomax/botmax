import React from 'react';
import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils';

const FlowNode = ({ 
  id,
  data, 
  selected = false, 
  icon, 
  title, 
  subtitle, 
  color = '#26C6B9',
  children,
  outputs = 1
}) => {
  return (
    <div 
      className={cn(
        "relative bg-white shadow-md rounded-xl overflow-hidden border transition-all transform",
        selected ? "border-2 border-primary shadow-primary/20" : "border border-gray-200",
        selected ? "scale-[1.02]" : "scale-100"
      )}
      style={{ 
        minWidth: '320px', 
        maxWidth: '400px'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center space-x-3" style={{ backgroundColor: color + '10' }}>
        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color }}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
          <p className="text-xs text-gray-500 truncate">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-gray-500">
          <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-md">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 17H9M21 10V8C21 6.89543 20.1046 6 19 6H16M3 10V8C3 6.89543 3.89543 6 5 6H8M8 6V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V6M8 6H16M19 21H5C3.89543 21 3 20.1046 3 19V15C3 13.8954 3.89543 13 5 13H19C20.1046 13 21 13.8954 21 15V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>0</span>
          </div>
          <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-md">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>0</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {children}
      </div>
      
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="w-3 h-3 rounded-full border-2 border-white bg-gray-400"
        style={{ left: -6 }}
      />

      {/* Output handles */}
      {Array.from({ length: outputs }).map((_, index) => (
        <Handle
          key={`out-${index}`}
          type="source"
          position={Position.Right}
          id={`out-${index}`}
          className="w-3 h-3 rounded-full border-2 border-white bg-gray-400"
          style={{ 
            right: -6, 
            top: outputs === 1 ? '50%' : `calc(40% + ${index * 25}px)` 
          }}
        />
      ))}
    </div>
  );
};

export default FlowNode;