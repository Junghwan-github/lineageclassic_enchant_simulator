import { UserType } from "./user";

export type SessionType = {
  session: {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      type?: UserType;
      point?: number;
    };
  } | null;
};
