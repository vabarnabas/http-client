// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { Pool } from "pg"

export default async function getPgTables(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { connectionString, sqlQuery } =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body

  if (req.method !== "POST") {
    return res.status(405).end()
  }

  if (!connectionString) {
    return res.status(400).end()
  }

  const pool = new Pool({ connectionString })

  try {
    const client = await pool.connect()
    const result = await client.query(
      sqlQuery ??
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    )
    const tables = result.rows.map((row: any) => row.table_name)
    client.release()
    res.status(200).json(sqlQuery ? result.rows : tables)
  } catch (error) {
    console.error("Error fetching tables:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
