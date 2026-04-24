import { NextRequest, NextResponse } from "next/server";
import pool from "@/shared/lib/db";
import { RowDataPacket } from "mysql2";

type ItemRow = RowDataPacket & {
  id: number;
  type: "weapon" | "armor" | "etc";
  name: string;
  icon: string;
  safe_enchant: number | null;
  texture: string | null;
  weight: number | null;
};

type DetailRow = RowDataPacket & {
  item_id: number;
  detail_key: string;
  detail_value: string;
};

type OptionRow = RowDataPacket & {
  item_id: number;
  option_text: string;
};

export async function GET(request: NextRequest) {
  try {
    const names = [...new Set(request.nextUrl.searchParams.getAll("name"))];
    const ids = [
      ...new Set(
        request.nextUrl.searchParams
          .getAll("id")
          .map((id) => Number(id))
          .filter((id) => !Number.isNaN(id))
      ),
    ];

    let items: ItemRow[] = [];

    if (ids.length > 0) {
      const mergedIds = [...new Set([...ids, 1, 2])];
      const placeholders = mergedIds.map(() => "?").join(", ");

      const [filteredItems] = await pool.query<ItemRow[]>(
        `
        SELECT
          id,
          type,
          name,
          icon,
          safe_enchant,
          texture,
          weight
        FROM items
        WHERE id IN (${placeholders})
        ORDER BY id ASC
        `,
        ids
      );

      items = filteredItems;
    } else if (names.length > 0) {
      const placeholders = names.map(() => "?").join(", ");

      const [filteredItems] = await pool.query<ItemRow[]>(
        `
        SELECT
          id,
          type,
          name,
          icon,
          safe_enchant,
          texture,
          weight
        FROM items
        WHERE name IN (${placeholders})
        ORDER BY id ASC
        `,
        names
      );

      items = filteredItems;
    } else {
      const [allItems] = await pool.query<ItemRow[]>(`
        SELECT
          id,
          type,
          name,
          icon,
          safe_enchant,
          texture,
          weight
        FROM items
        ORDER BY id ASC
      `);

      items = allItems;
    }

    if (items.length === 0) {
      return NextResponse.json(
        { message: "해당 아이템이 없습니다." },
        { status: 404 }
      );
    }

    const itemIds = items.map((item) => item.id);
    const idPlaceholders = itemIds.map(() => "?").join(", ");

    const [details] = await pool.query<DetailRow[]>(
      `
      SELECT
        item_id,
        detail_key,
        detail_value
      FROM item_details
      WHERE item_id IN (${idPlaceholders})
      ORDER BY id ASC
      `,
      itemIds
    );

    const [options] = await pool.query<OptionRow[]>(
      `
      SELECT
        item_id,
        option_text
      FROM item_options
      WHERE item_id IN (${idPlaceholders})
      ORDER BY id ASC
      `,
      itemIds
    );

    const result = items.map((item) => {
      const itemDetails = details.filter((detail) => detail.item_id === item.id);
      const itemOptions = options
        .filter((option) => option.item_id === item.id)
        .map((option) => option.option_text);

      const detailArray: Record<string, string | number | string[]>[] =
        itemDetails.map((detail) => {
          const numericKeys = [
            "current_enchant",
            "s_damage",
            "l_damage",
            "ac",
          ];

          return {
            [detail.detail_key]: numericKeys.includes(detail.detail_key)
              ? Number(detail.detail_value)
              : detail.detail_value,
          };
        });

      if (itemOptions.length > 0) {
        detailArray.push({ option: itemOptions });
      }

      return {
        id: item.id,
        type: item.type,
        name: item.name,
        icon: item.icon,
        safe_enchant: item.safe_enchant,
        detail: detailArray,
        texture: item.texture,
        weight: item.weight,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/items error:", error);
    return NextResponse.json(
      { message: "아이템 조회 실패" },
      { status: 500 }
    );
  }
}