import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertUserSchema } from '@shared/schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// ENV validation
const JWT_SECRET = process.env.JWT_SECRET || 'flowbot-secret-key';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Auth controller methods
export const register = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);
    const { confirmPassword, ...userData } = validatedData;
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create user with hashed password
    const user = await storage.createUser({
      ...userData,
      password: hashedPassword,
    });
    
    // Create tenant for the user
    const subdomain = userData.username.toLowerCase().replace(/[^a-z0-9]/g, '');
    const tenant = await storage.createTenant({
      userId: user.id,
      name: userData.fullName || userData.username,
      subdomain: subdomain,
    });

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, tenantId: tenant.id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data and token (excluding password)
    const { password, ...userWithoutPassword } = user;
    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
      tenant,
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);
    
    // Find user by email
    const user = await storage.getUserByEmail(validatedData.email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Get tenant for the user
    const tenant = await storage.getTenantByUserId(user.id);
    if (!tenant) {
      return res.status(404).json({ message: "No tenant found for this user" });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, tenantId: tenant.id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return user data and token (excluding password)
    const { password, ...userWithoutPassword } = user;
    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      tenant,
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Return user data (excluding password)
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Validate input
    const updateSchema = z.object({
      fullName: z.string().optional(),
      username: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      avatar: z.string().optional(),
    });
    
    const validatedData = updateSchema.parse(req.body);
    const { avatar, ...userData } = validatedData;
    
    // Se uma nova imagem foi enviada, fazer upload para o bucket
    let avatarUrl = undefined;
    if (avatar) {
      if (avatar.startsWith('data:image/')) {
        // Upload da nova imagem
        const { uploadAvatar } = await import('../services/storage.service');
        avatarUrl = await uploadAvatar(userId, avatar);
      } else if (avatar === '') {
        // Se o avatar for string vazia, remover o avatar atual
        avatarUrl = '';
      } else {
        // Se o avatar for uma URL existente, mantê-la
        avatarUrl = avatar;
      }
    }
    
    // Update user
    const updatedUser = await storage.updateUser(userId, { 
      ...userData,
      ...(avatarUrl !== undefined ? { avatar: avatarUrl } : {})
    });
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Return updated user data (excluding password)
    const { password, ...userWithoutPassword } = updatedUser;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Validate input
    const passwordSchema = z.object({
      currentPassword: z.string(),
      newPassword: z.string().min(6),
      confirmPassword: z.string().min(6),
    }).refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });
    
    const validatedData = passwordSchema.parse(req.body);
    
    // Get current user
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);
    
    // Update password
    await storage.updateUser(userId, { password: hashedPassword });
    
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
