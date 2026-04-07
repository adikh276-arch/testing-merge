import { Pool, PoolClient } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Database features will not work.");
}

const globalPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const getDbClient = async (schema: string): Promise<PoolClient> => {
  const client = await globalPool.connect();
  
  // Set the search path for this specific client connection
  // Ensure we include 'core' schema for shared tables like 'users'
  await client.query(`SET search_path TO "${schema}", core`);
  
  return client;
};

// Expose a quick query helper if you want to run single shots
export const query = async (text: string, params: any[] = [], schema: string = "core") => {
  const client = await getDbClient(schema);
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
};
