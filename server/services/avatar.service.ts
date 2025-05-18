import { Client } from '@replit/object-storage';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Bucket ID específico fornecido pelo usuário
const bucketId = 'replit-objstore-dbf27d60-62f3-4146-84c4-8aa0a815da56';

// Criando cliente do Object Storage do Replit
const storage = new Client({
  bucketId: bucketId
});

// ID da repl para construção de URLs
const replId = process.env.REPL_ID || '0e150fa7-be26-4fab-9225-3e45b76973e7';

/**
 * Salva uma imagem base64 em disco e retorna o caminho do arquivo
 */
function saveBase64ImageToFile(imageData: string, userId: number): { filePath: string, fileExtension: string } {
  // Extrair tipo e dados
  const matches = imageData.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Formato de imagem inválido');
  }
  
  const fileExtension = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Criar caminho temporário
  const tempDir = path.join(os.tmpdir(), 'avatars');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const timestamp = Date.now();
  const filename = `avatar_${userId}_${timestamp}.${fileExtension}`;
  const filePath = path.join(tempDir, filename);
  
  // Salvar arquivo
  fs.writeFileSync(filePath, buffer);
  
  return { filePath, fileExtension };
}

/**
 * Faz upload de uma imagem de avatar para o bucket do Replit
 */
export async function uploadAvatar(userId: number, imageData: string): Promise<string> {
  try {
    console.log(`Iniciando upload de avatar para usuário ${userId}`);

    // Salvar em arquivo temporário
    const { filePath, fileExtension } = saveBase64ImageToFile(imageData, userId);
    
    // Nome do objeto no bucket
    const objectKey = `avatars/${userId}_${Date.now()}.${fileExtension}`;
    
    console.log(`Fazendo upload para bucket ${bucketId}, objeto: ${objectKey}`);
    
    // Fazer upload do arquivo para o Object Storage
    await storage.uploadFromFilename(objectKey, filePath);
    
    // Limpar o arquivo temporário
    fs.unlinkSync(filePath);
    
    // URL para acessar o avatar
    const avatarUrl = `/api/storage/${objectKey}`;
    console.log(`Avatar salvo com sucesso: ${avatarUrl}`);
    
    return avatarUrl;
  } catch (error) {
    console.error('Erro ao fazer upload de avatar:', error);
    throw new Error(`Falha ao processar imagem: ${error.message}`);
  }
}

/**
 * Deleta uma imagem de avatar do bucket
 */
export async function deleteAvatar(avatarUrl: string): Promise<void> {
  try {
    // Extrair a chave do objeto a partir da URL
    // Formato esperado: /api/storage/avatars/123_timestamp.jpg
    const pathParts = avatarUrl.split('/');
    if (pathParts.length < 3) {
      console.warn('URL de avatar inválida:', avatarUrl);
      return;
    }
    
    // Pegar o caminho após /api/storage/
    const objectKey = pathParts.slice(3).join('/');
    
    // Verificar se o objeto existe
    console.log(`Verificando existência do objeto: ${objectKey}`);
    const exists = await storage.exists(objectKey);
    
    if (exists) {
      console.log(`Deletando objeto: ${objectKey}`);
      await storage.delete(objectKey);
      console.log('Avatar deletado com sucesso');
    } else {
      console.warn(`Objeto não encontrado: ${objectKey}`);
    }
  } catch (error) {
    console.error('Erro ao deletar avatar:', error);
  }
}