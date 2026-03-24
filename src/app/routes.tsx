import { createBrowserRouter, Navigate } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { Portfolio } from "./pages/Portfolio";
import { Certificates } from "./pages/Certificates";
import { Admin } from "./pages/AdminEnhanced";
import { Login } from "./pages/Login";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Blog }, // Maqolalar asosiy sahifa
      { path: "about", Component: Home }, // About sahifasi
      { path: "blog/:slug", Component: BlogPost },
      { path: "portfolio", Component: Portfolio },
      { path: "certificates", Component: Certificates },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    ),
  },
]);