import { Suspense } from "react";
import SignupPage from "./SignupPage";

const SignUp = () => {
  return (
    <Suspense fallback={null}>
      <SignupPage />
    </Suspense>
  );
};

export default SignUp;
