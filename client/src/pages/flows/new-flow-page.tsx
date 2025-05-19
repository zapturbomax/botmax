import React from 'react';
import { useParams } from 'wouter';
import NewFlowPage from '@/components/flow-builder/NewFlowPage';

/**
 * Página de fluxo que utiliza o novo design do Flow Builder
 */
const FlowDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return <NewFlowPage />;
};

export default FlowDetailsPage;