import { Client } from '@replit/object-storage';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Criando cliente do Object Storage do Replit com o bucket ID específico
const bucketId = 'replit-objstore-dbf27d60-62f3-4146-84c4-8aa0a815da56';
const objectStorage = new Client({
  bucketId: bucketId
});

/**
 * Faz upload de uma imagem de avatar para o bucket do Replit
 */
export async function uploadAvatar(userId: number, imageData: string): Promise<string> {
  try {
    // Verificar se é uma imagem base64 válida
    if (!imageData.startsWith('data:image/')) {
      throw new Error('Formato de imagem inválido');
    }

    // Extrair o tipo MIME e os dados
    const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Formato de dados base64 inválido');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const fileExtension = mimeType.split('/')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Salvar temporariamente o arquivo
    const tempFilePath = path.join(os.tmpdir(), `avatar_${userId}_${Date.now()}.${fileExtension}`);
    fs.writeFileSync(tempFilePath, buffer);
    
    // Nome único do arquivo no bucket
    const fileName = `avatars/${userId}_${Date.now()}.${fileExtension}`;
    
    // Fazer upload para o Replit Object Storage
    await objectStorage.uploadFromFilename(
      fileName,
      tempFilePath
    );
    
    // Limpar o arquivo temporário
    fs.unlinkSync(tempFilePath);
    
    // Construir a URL pública para o objeto
    const url = `https://${bucketId}.replit.dev/${fileName}`;
    
    return url;
  } catch (error) {
    console.error('Erro ao fazer upload do avatar:', error);
    throw error;
  }
}

/**
 * Deleta uma imagem de avatar do bucket do Replit
 */
export async function deleteAvatar(avatarUrl: string): Promise<void> {
  try {
    // Extrair o nome do arquivo da URL
    const parsedUrl = new URL(avatarUrl);
    const pathParts = parsedUrl.pathname.split('/');
    // Remover primeira barra e pegar o resto do caminho
    const fileName = pathParts.slice(1).join('/');
    
    if (!fileName) {
      console.warn('Nome de arquivo inválido ao tentar deletar avatar:', avatarUrl);
      return;
    }
    
    // Tentar deletar o arquivo
    try {
      await objectStorage.delete(fileName);
      console.log(`Avatar deletado com sucesso: ${fileName}`);
    } catch (err) {
      console.warn(`Arquivo não encontrado ou erro ao deletar: ${fileName}`, err);
    }
  } catch (error) {
    console.error('Erro ao processar a URL do avatar para deleção:', error);
  }
}