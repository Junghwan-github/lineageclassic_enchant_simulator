import { ReactNode } from "react";
import styles from "./layout.module.css";
import { auth } from "@/auth";
import LoginForm from "@/features/auth/ui/LoginForm";
import { AdminHeader } from "@/widgets/admin/header";
import { SideBar } from "@/widgets/admin/side-bar";

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const session = await auth();
  if (session?.user?.type !== "ADMIN") {
    return (
      <div className={styles.admin_signin}>
        <main className={styles.content}>
          <h3>로그인</h3>
          <LoginForm />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.admin_layout}>
      <div className={styles.container}>
        <header className={styles.header}>
            <AdminHeader />
        </header>
        <main className={styles.main}>
          <div className={styles.navigation}>
            <SideBar />
          </div>
          <article className={styles.article}>{children}</article>
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
