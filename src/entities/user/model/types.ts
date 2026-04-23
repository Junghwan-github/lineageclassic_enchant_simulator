import { UserType } from "@/shared/types/user";

export interface User {
    id: number;
    name: string;
    email: string;
    point: number;
    type: UserType;
}

export interface LoginUser {
  id: number;
  name: string;
  email: string;
  point: number;
  type: UserType;
  membership: string | null;
}