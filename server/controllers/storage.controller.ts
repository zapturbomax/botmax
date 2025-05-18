import { Request, Response } from 'express';
import { Client } from '@replit/object-storage';

// Bucket ID fornecido pelo usuário
const bucketId = 'replit-objstore-dbf27d60-62f3-4146-84c4-8aa0a815da56';
const storage = new Client({ bucketId });

/**
 * Obtém um arquivo do bucket do Replit e o serve como resposta HTTP
 */
export const getFile = async (req: Request, res: Response) => {
  try {
    const filePath = req.params['0']; // Usando o wildcard para pegar todo o caminho
    
    if (!filePath) {
      return res.status(400).json({ message: 'Caminho do arquivo não especificado' });
    }
    
    console.log(`Buscando arquivo: ${filePath} do bucket ${bucketId}`);
    
    // Verifica se o arquivo existe no bucket
    const exists = await storage.exists(filePath);
    if (!exists) {
      console.log(`Arquivo não encontrado: ${filePath}`);
      return res.status(404).json({ message: 'Arquivo não encontrado' });
    }
    
    // Determina o tipo MIME com base na extensão do arquivo
    const fileExtension = filePath.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream'; // Tipo padrão
    
    if (fileExtension) {
      switch (fileExtension) {
        case 'jpg':
        case 'jpeg':
          contentType = 'image/jpeg';
          break;
        case 'png':
          contentType = 'image/png';
          break;
        case 'gif':
          contentType = 'image/gif';
          break;
        case 'webp':
          contentType = 'image/webp';
          break;
        case 'svg':
          contentType = 'image/svg+xml';
          break;
      }
    }
    
    // Define o cabeçalho de tipo de conteúdo
    res.setHeader('Content-Type', contentType);
    
    // Define os cabeçalhos de cache para melhorar o desempenho
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
    
    console.log(`Servindo arquivo ${filePath} com tipo ${contentType}`);
    
    // Baixa o arquivo como um stream e o envia como resposta
    const fileStream = await storage.downloadAsStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Erro ao servir arquivo do storage:', error);
    res.status(500).json({ message: 'Erro ao servir arquivo' });
  }
};