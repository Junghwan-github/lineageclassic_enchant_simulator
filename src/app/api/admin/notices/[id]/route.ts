import { NextResponse } from "next/server";
import pool from "@/shared/lib/db";

export async function GET(
  req: Request,
  { params }: RouteContext<"/api/admin/notices/[id]">,
) {
  try {
    const { id } = await params;

    const [rows]: any = await pool.query(
      `
      SELECT
        n.id,
        n.title,
        n.content,
        n.views,
        n.created_at AS createdAt,
        n.updated_at AS updatedAt,
        u.name AS author
      FROM notices n
      JOIN users u ON n.user_id = u.id
      WHERE n.id = ?
      `,
      [id],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "공지사항을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "공지사항 상세 조회 성공",
      data: rows[0],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "공지사항 조회 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
