import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { Portfolio } from "./pages/Portfolio";
import { Certificates } from "./pages/Certificates";
import { Admin } from "./pages/AdminEnhanced";

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
    path: "/admin",
    Component: Admin,
  },
]);