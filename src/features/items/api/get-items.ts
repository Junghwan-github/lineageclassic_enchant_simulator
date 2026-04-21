import { api } from "@/shared/api/api";

export type Item = {
  id: number;
  type: "weapon" | "armor" | "etc";
  name: string;
  icon: string;
  safe_enchant: number | null;
  texture: string | null;
  weight: number | null;
  detail?: any[];
};

export const getItems = async () => {
  const res = await api.get<Item[]>("/items");
  return res.data;
};

export const getItemsByNames = async (names: string[]) => {
  const res = await api.get<Item[]>("/items", {
    params: {
      name: names,
    },
  });

  return res.data;
};

export const getItemsByIds = async (ids: number[]) => {
  const res = await api.get<Item[]>("/items", {
    params: {
      id: ids, 
    },
  });

  return res.data;
};