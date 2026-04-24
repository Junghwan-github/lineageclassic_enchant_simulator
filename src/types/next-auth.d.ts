// src/types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";
import { UserType } from "@/shared/types/user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      point: number;
      type: UserType;
      membership: string | null;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    point: number;
    type: UserType;
    membership: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    point?: number;
    type?: UserType;
    membership?: string | null;
  }
}