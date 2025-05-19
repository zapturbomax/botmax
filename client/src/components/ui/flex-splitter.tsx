import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface FlexSplitterProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  initialSizes?: number[]; // Array de porcentagens (0-100)
  className?: string;
}

interface FlexPanelProps {
  children: React.ReactNode;
  className?: string;
  minSize?: number; // Porcentagem mínima (0-100)
  maxSize?: number; // Porcentagem máxima (0-100)
}

const FlexSplitter: React.FC<FlexSplitterProps> = ({ 
  children, 
  direction = 'horizontal', 
  initialSizes,
  className 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [panels, setPanels] = useState<HTMLDivElement[]>([]);
  const [resizers, setResizers] = useState<HTMLDivElement[]>([]);
  const [sizes, setSizes] = useState<number[]>([]);
  const [resizing, setResizing] = useState<boolean>(false);
  
  // Inicializar os tamanhos
  useEffect(() => {
    if (!containerRef.current) return;
    
    const panelElements = Array.from(
      containerRef.current.querySelectorAll('[data-panel]')
    ) as HTMLDivElement[];
    
    const resizerElements = Array.from(
      containerRef.current.querySelectorAll('[data-resizer]')
    ) as HTMLDivElement[];
    
    setPanels(panelElements);
    setResizers(resizerElements);
    
    if (initialSizes && initialSizes.length === panelElements.length) {
      setSizes(initialSizes);
    } else {
      // Distribuir igualmente
      const equalSize = 100 / panelElements.length;
      setSizes(Array(panelElements.length).fill(equalSize));
    }
  }, [initialSizes]);
  
  // Aplicar tamanhos aos painéis
  useEffect(() => {
    if (panels.length === 0 || sizes.length === 0) return;
    
    panels.forEach((panel, index) => {
      if (direction === 'horizontal') {
        panel.style.width = `${sizes[index]}%`;
        panel.style.height = '100%';
      } else {
        panel.style.height = `${sizes[index]}%`;
        panel.style.width = '100%';
      }
    });
  }, [panels, sizes, direction]);
  
  // Configurar handlers de resize
  useEffect(() => {
    if (resizers.length === 0 || panels.length === 0) return;
    
    const handleMouseDown = (e: MouseEvent, index: number) => {
      e.preventDefault();
      setResizing(true);
      
      const startPosition = direction === 'horizontal' ? e.clientX : e.clientY;
      const leftPanel = panels[index];
      const rightPanel = panels[index + 1];
      
      // Obter os tamanhos iniciais e restrições
      const leftPanelMinSize = parseFloat(leftPanel.dataset.minSize || '0');
      const leftPanelMaxSize = parseFloat(leftPanel.dataset.maxSize || '100');
      const rightPanelMinSize = parseFloat(rightPanel.dataset.minSize || '0');
      const rightPanelMaxSize = parseFloat(rightPanel.dataset.maxSize || '100');
      
      const containerSize = direction === 'horizontal' 
        ? containerRef.current!.offsetWidth 
        : containerRef.current!.offsetHeight;
      
      const handleMouseMove = (moveEvent: MouseEvent) => {
        const currentPosition = direction === 'horizontal' ? moveEvent.clientX : moveEvent.clientY;
        const difference = currentPosition - startPosition;
        
        // Calcular a diferença em porcentagem
        const diffPercent = (difference / containerSize) * 100;
        
        // Verificar limites
        const newLeftSize = Math.min(
          Math.max(sizes[index] + diffPercent, leftPanelMinSize),
          leftPanelMaxSize
        );
        
        const newRightSize = Math.min(
          Math.max(sizes[index + 1] - diffPercent, rightPanelMinSize),
          rightPanelMaxSize
        );
        
        // Atualizar tamanhos
        const newSizes = [...sizes];
        newSizes[index] = newLeftSize;
        newSizes[index + 1] = newRightSize;
        
        setSizes(newSizes);
      };
      
      const handleMouseUp = () => {
        setResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    
    // Adicionar event listeners
    resizers.forEach((resizer, index) => {
      const handler = (e: MouseEvent) => handleMouseDown(e, index);
      resizer.addEventListener('mousedown', handler);
      
      return () => {
        resizer.removeEventListener('mousedown', handler);
      };
    });
    
  }, [resizers, panels, sizes, direction]);
  
  // Renderizar os painéis e os resizers entre eles
  const renderChildren = () => {
    const childrenArray = React.Children.toArray(children);
    const result: React.ReactNode[] = [];
    
    childrenArray.forEach((child, index) => {
      // Adicionar o painel
      result.push(
        React.cloneElement(child as React.ReactElement, {
          key: `panel-${index}`,
          'data-panel': true,
          'data-min-size': (child as React.ReactElement).props.minSize,
          'data-max-size': (child as React.ReactElement).props.maxSize,
        })
      );
      
      // Adicionar o resizer (exceto após o último painel)
      if (index < childrenArray.length - 1) {
        result.push(
          <div
            key={`resizer-${index}`}
            className={cn(
              'resizer flex-shrink-0 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-col-resize',
              direction === 'horizontal' ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'
            )}
            data-resizer
          />
        );
      }
    });
    
    return result;
  };
  
  return (
    <div
      ref={containerRef}
      className={cn(
        'flex w-full h-full overflow-hidden',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        resizing && 'select-none',
        className
      )}
    >
      {renderChildren()}
    </div>
  );
};

const FlexPanel: React.FC<FlexPanelProps> = ({ children, className, minSize, maxSize }) => {
  return (
    <div className={cn('flex-panel overflow-hidden', className)}>
      {children}
    </div>
  );
};

export { FlexSplitter, FlexPanel };