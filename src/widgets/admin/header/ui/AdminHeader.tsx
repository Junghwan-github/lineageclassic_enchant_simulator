import { logoutAction } from "@/features/auth/model/actions";
import styles from "./AdminHeader.module.css";

const AdminHeader = () => {
  return (
    <div className={styles.content}>
      <h1><span>Admin</span>istrator</h1>
      <div className={styles.header_nav}>
        <button type="button" onClick={logoutAction}>로그아웃</button>
      </div>
    </div>
  );
};

export default AdminHeader;
