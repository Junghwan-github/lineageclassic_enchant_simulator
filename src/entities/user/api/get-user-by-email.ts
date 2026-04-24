// src/entities/user/api/get-user-by-email.ts
import pool from "@/shared/lib/db";
import { RowDataPacket } from "mysql2";
import { UserType } from "@/shared/types/user";

export interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  point: number;
  user_type: UserType;
  membership: string | null;
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  const [rows] = await pool.query<UserRow[]>(
    `
      SELECT
        id,
        name,
        email,
        password,
        point,
        user_type,
        membership
      FROM users
      WHERE email = ?
      LIMIT 1
    `,
    [email]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}