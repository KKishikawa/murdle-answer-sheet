import { Toaster } from "@/components/ui/sonner";
import { Header } from "./header";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <footer>
        <h1>Footer</h1>
      </footer>
      <Toaster />
    </div>
  );
};
