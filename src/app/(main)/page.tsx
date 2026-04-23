import styles from "./page.module.css";
import { Content } from "@/widgets/content";
import { auth } from "@/auth";
import MainLayout from "./layout";

export default async function Home() {
  const session = await auth();

  console.log("session:", session);

  return (
    <div className={styles.container}>
      <Content />
    </div>
  );
}
