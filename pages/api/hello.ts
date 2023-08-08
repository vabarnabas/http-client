// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

export default async function getPgTables(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { connectionString } = req.body;

  if (req.method !== "POST" || !connectionString) {
    return res.status(405).end();
  }

  const pool = new Pool({ connectionString });

  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = $1",
      ["public"]
    );
    const tables = result.rows.map((row) => row.table_name);
    client.release();
    res.status(200).json(tables);
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
