import { NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/shared/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    if (session.user.type !== "ADMIN") {
      return NextResponse.json(
        { message: "관리자만 등록할 수 있습니다." },
        { status: 403 },
      );
    }

    const { title, content } = await req.json();

    if (!title?.trim()) {
      return NextResponse.json(
        { message: "제목을 입력해주세요." },
        { status: 400 },
      );
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { message: "내용을 입력해주세요." },
        { status: 400 },
      );
    }

    await pool.query(
      `
        INSERT INTO notices (
          title,
          user_id,
          content
        ) VALUES (?, ?, ?)
      `,
      [title, session.user.id, content],
    );

    return NextResponse.json(
      { message: "공지사항이 등록되었습니다." },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "공지사항 등록 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
    try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 15);
    const offset = (page - 1) * limit;

    const [countRows]: any = await pool.query(
      `
      SELECT COUNT(*) AS totalCount
      FROM notices
      `
    );

    const totalCount = countRows[0].totalCount;
    const totalPage = Math.ceil(totalCount / limit);

    const [rows]: any = await pool.query(
      `
      SELECT
        n.id,
        n.title,
        n.views,
        n.created_at AS createdAt,
        u.name AS author
      FROM notices n
      JOIN users u ON n.user_id = u.id
      ORDER BY n.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );

    return NextResponse.json({
      message: "공지사항 목록 조회 성공",
      data: {
        list: rows,
        totalCount,
        totalPage,
        currentPage: page,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "공지사항 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
