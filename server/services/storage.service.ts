import { createClient } from '@replit/object-storage';

// Criando cliente do Object Storage do Replit
const storageClient = createClient();
const BUCKET_PREFIX = 'avatars';

export async function uploadAvatar(userId: number, imageData: string): Promise<string> {
  try {
    // Verificar se é uma imagem base64 válida
    if (!imageData.startsWith('data:image/')) {
      throw new Error('Formato de imagem inválido');
    }

    // Extrair o tipo MIME e os dados
    const matches = imageData.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Formato de dados base64 inválido');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const fileExtension = mimeType.split('/')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Nome único do arquivo no bucket
    const fileName = `${BUCKET_PREFIX}/${userId}_${Date.now()}.${fileExtension}`;
    
    // Fazer upload para o Replit Object Storage
    await storageClient.setItem(fileName, buffer, {
      mimeType
    });
    
    // Construir a URL pública para o objeto
    const hostname = process.env.REPLIT_DOMAIN || `${process.env.REPL_ID}.id.repl.co`;
    const url = `https://${hostname}/${fileName}`;
    
    return url;
  } catch (error) {
    console.error('Erro ao fazer upload do avatar:', error);
    throw error;
  }
}

export async function deleteAvatar(avatarUrl: string): Promise<void> {
  try {
    // Extrair o nome do arquivo da URL
    const urlParts = new URL(avatarUrl);
    const pathName = urlParts.pathname.substring(1); // Remover a primeira barra
    
    // Verificar se o arquivo existe
    if (await storageClient.hasItem(pathName)) {
      // Deletar o arquivo
      await storageClient.deleteItem(pathName);
    }
  } catch (error) {
    console.error('Erro ao deletar avatar:', error);
    throw error;
  }
}