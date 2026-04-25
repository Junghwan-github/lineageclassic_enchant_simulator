import NoticeList from "@/widgets/notice/list/ui/NoticeList";
import styles from "./page.module.css";

const Notice = () => {
    return (
        <div className={styles.container}>
            <NoticeList theme={"dark"} limit={10} />
        </div>
    )
}

export default Notice;