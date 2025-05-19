import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// ENV validation
const JWT_SECRET = process.env.JWT_SECRET || 'flowbot-secret-key';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
        tenantId: number;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    console.log("Autenticação falhou: Nenhum token fornecido");
    return res.status(401).json({ message: 'No authorization token was found' });
  }
  
  // Check if token follows the Bearer format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log("Autenticação falhou: Formato de token inválido");
    return res.status(401).json({ message: 'Authorization token format is invalid' });
  }
  
  const token = parts[1];
  
  try {
    // Verificar se o token está vazio ou é inválido
    if (!token || token === 'undefined' || token === 'null') {
      console.log("Autenticação falhou: Token vazio ou inválido");
      return res.status(401).json({ message: 'Empty or invalid token' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      role: string;
      tenantId: number;
    };
    
    // Verificar se o token decodificado contém todos os campos necessários
    if (!decoded.id || !decoded.email || !decoded.tenantId) {
      console.log("Autenticação falhou: Token não contém informações necessárias");
      return res.status(401).json({ message: 'Invalid token: missing required fields' });
    }
    
    // Add user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    console.log("Autenticação falhou: Erro ao verificar token", error);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token', code: 'INVALID_TOKEN' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    next();
  };
};
