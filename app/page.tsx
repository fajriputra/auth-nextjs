import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { AuthButtonWrapper } from "@/components/partials/auth";

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
        <AuthButtonWrapper>
          <Button variant="secondary" size="lg">
            Log in
          </Button>
        </AuthButtonWrapper>
      </div>
    </main>
  );
};

export default Home;
