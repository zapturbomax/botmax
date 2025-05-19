# Prompt 12: Atualização do App.tsx

Este arquivo atualiza o componente App.tsx para incluir a rota do Flow Builder em tela cheia.

```tsx
// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FlowBuilderLayout from '@/components/flow-builder/FlowBuilderLayout';
import FlowsPage from '@/pages/FlowsPage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/LoginPage';
import { useAuth } from '@/hooks/use-auth';

function App() {
  const { isAuthenticated } = useAuth();
  
  // Redirecionar para login se não estiver autenticado
  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </Router>
    );
  }
  
  return (
    <Router>
      <Routes>
        {/* Rotas com layout de dashboard */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/flows" replace />} />
          <Route path="/flows" element={<FlowsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        
        {/* Rota do Flow Builder em tela cheia */}
        <Route 
          path="/flows/:flowId/builder" 
          element={
            <FlowBuilderLayout 
              flowId=":flowId" 
              flowName="Meu Fluxo" 
            />
          } 
        />
        
        {/* Rota padrão */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
```

## Características Principais

1. **Rota Específica**: Adiciona uma rota específica para o Flow Builder (`/flows/:flowId/builder`)
2. **Tela Cheia**: Renderiza o FlowBuilderLayout fora do DashboardLayout para ocupar toda a tela
3. **Autenticação**: Verifica se o usuário está autenticado antes de renderizar as rotas
4. **Redirecionamento**: Redireciona para a página de login se o usuário não estiver autenticado
5. **Toaster**: Inclui o componente Toaster para exibir notificações

Esta atualização é essencial para que o Flow Builder seja exibido em tela cheia, sem as barras laterais do layout do dashboard, exatamente como no dispara.ai.
