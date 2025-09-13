
import Courses from "@/pages/Courses";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home.jsx";
import Profile from "@/pages/Profile";


export const routes = [
  {
    name: "home",
    path: "/home",
    element: <Home />,
  },
  {
    name: "profile",
    path: "/profile",
    element: <Profile />,
  },
  {
    name: "courses",
    path: "/courses",
    element: <Courses />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    name: "Docs",
    href: "https://www.material-tailwind.com/docs/react/installation",
    target: "_blank",
    element: "",
  },
];

export default routes;
