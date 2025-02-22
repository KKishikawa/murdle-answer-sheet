import { ModeToggle } from "@/components/utility/mode-toggle";

export const Header = () => {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>Header</h1>
      <ModeToggle />
    </header>
  );
};
