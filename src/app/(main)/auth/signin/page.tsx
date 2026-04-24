import { auth } from "@/auth";
import SigninPage from "./SigninPage";
import { redirect } from "next/navigation";

const SignIn = async () => {
  const session = await auth();

  if(session?.user) {
    redirect("/");
  }

  return (
    <SigninPage />
  );
};

export default SignIn;
