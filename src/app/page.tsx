import styles from "./page.module.css";
import { Content } from "@/widgets/content";



export default function Home() {
  return (
    <div className={styles.container}>
      <Content />
    </div>
  );
}
