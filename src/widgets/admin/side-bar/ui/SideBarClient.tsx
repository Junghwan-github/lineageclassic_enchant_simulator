import { SessionType } from "@/shared/types/session";
import styles from "./SideBarClient.module.css";
import PointIcon from "@/shared/ui/PointIcon/PointIcon";

const SideBarClient = ({ session }: SessionType) => {
  return (
    <div className={styles.container}>
      <div className={styles.user_info}>
        {session?.user && (
          <ul>
            <li>{session.user.name}</li>
            <li>{session.user.email}</li>
            <li>
              <span>포인트</span>
              <p>
                {session.user.point}
                <PointIcon width={20} />
              </p>
            </li>
            <li>
              <span>권한</span>
              <p>{session.user.type}</p>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default SideBarClient;
