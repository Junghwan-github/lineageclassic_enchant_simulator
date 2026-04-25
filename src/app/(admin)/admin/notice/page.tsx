import NoticeList from "@/widgets/notice/list/ui/NoticeList";
import styles from "./page.module.css";

const AdminNotice = () => {
    return(
        <div className={styles.wrap}>
            <div className={styles.container}>
                 <h2>공지 목록</h2>
                 <div className={styles.content}>
                    <NoticeList theme={"light"} limit={10} />
                 </div>
            </div>
        </div>
    )
}

export default AdminNotice;