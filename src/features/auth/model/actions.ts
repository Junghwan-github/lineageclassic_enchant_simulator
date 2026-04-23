"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import pool from "@/shared/lib/db";
import { UserType } from "@/shared/types/user";
import { RowDataPacket } from "mysql2";
import { AuthError } from "next-auth";

interface ExistingUserRow extends RowDataPacket {
  id: number;
}

export async function loginAction(formData: FormData) {
   try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirect: false,
    });

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            error: "아이디 또는 비밀번호가 올바르지 않습니다.",
          };
        default:
          return {
            success: false,
            error: "로그인 중 오류가 발생했습니다.",
          };
      }
    }

    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function signupAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!name || !email || !password) {
    throw new Error("필수값이 비어있습니다.");
  }

  const [existingRows] = await pool.query<ExistingUserRow[]>(
    `SELECT id FROM users WHERE email = ? LIMIT 1`,
    [email],
  );

  if (existingRows.length > 0) {
    throw new Error("이미 사용 중인 이메일입니다.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    `
      INSERT INTO users (
        name,
        email,
        password,
        point,
        user_type,
        membership
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [name, email, hashedPassword, 0, UserType.NORMAL, null],
  );

  redirect("/auth/signin?signup=success");
}
