import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import AuthCardWrapper from "./AuthCardWrapper";

const AuthErrorCard = () => {
  return (
    <AuthCardWrapper
      label="Oops! Something went wrong"
      button_text="Back to login"
      button_url="/auth/login"
    >
      <div className="flex justify-center items-center flex-col space-y-4">
        <ExclamationTriangleIcon className="text-destructive" />
        <p className="text-sm text-red-500 text-center">
          We are sorry, but there was an error processing your request. Please
          try again.
        </p>
      </div>
    </AuthCardWrapper>
  );
};

export default AuthErrorCard;
