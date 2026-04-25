import NoticeDetail from "@/widgets/notice/detail/ui/NoticeDetail";
import styles from "./page.module.css";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const NoticeDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  return (
    <div className={styles.notice_wrap}>
      <NoticeDetail id={id} />
    </div>
  );
};

export default NoticeDetailPage;
