import LoginButton from "@/components/auth/LoginButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const Home = () => {
  return (
    <main className="main-auth-background">
      <div className="flex flex-col gap-y-6 justify-center items-center">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            font.className
          )}
        >
          Auth
        </h1>
        <p className="text-white text-lg">A simple authentication service</p>
        <LoginButton>
          <Button variant="secondary" size="lg">
            Sign in
          </Button>
        </LoginButton>
      </div>
    </main>
  );
};

export default Home;
