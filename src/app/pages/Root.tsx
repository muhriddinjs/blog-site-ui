import { Outlet, useNavigate } from "react-router";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";

export function Root() {
  const navigate = useNavigate();

  // Ctrl + Shift + A shortcut for admin page
  useKeyboardShortcut({
    ctrl: true,
    shift: true,
    key: "a",
    onTrigger: () => navigate("/admin"),
  });

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}