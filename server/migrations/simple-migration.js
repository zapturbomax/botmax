
import pg from 'pg';
const { Pool } = pg;

async function runMigration() {
  // Configuração da conexão com o banco de dados
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres',
  });

  try {
    console.log('Iniciando migração para adicionar coluna is_beta...');
    
    // Verificar se a coluna já existe
    const checkResult = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'flows' AND column_name = 'is_beta'
    `);
    
    if (checkResult.rows.length === 0) {
      // Adicionar a coluna is_beta
      await pool.query(`
        ALTER TABLE flows
        ADD COLUMN is_beta BOOLEAN NOT NULL DEFAULT FALSE
      `);
      console.log('Coluna is_beta adicionada com sucesso!');
    } else {
      console.log('Coluna is_beta já existe. Nenhuma alteração necessária.');
    }
    
    console.log('Migração concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a migração:', error);
  } finally {
    await pool.end();
  }
}

// Executar a migração
runMigration();
