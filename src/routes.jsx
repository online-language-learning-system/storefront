
import Courses from "@/pages/Courses";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home.jsx";
import Profile from "@/pages/Profile";
import Payment from "@/pages/Payment";
import TryCourse from "@/pages/TryCourse";
import CourseDetail from "./pages/CourseDetail";
import PersonalCourse from "@/pages/PersonalCourse";
export const routes = [
  {
    name: "Trang chủ",
    path: "/home",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    name: "Khóa học",
    path: "/courses",
    element: <Courses />,
  },
  {
    path: "/payment",        
    element: <Payment />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },

  {
  path: "/courses/:id",
  element: <CourseDetail />,
},
  {
    path: "/courses/:id/trial",
    element: <TryCourse />,
  },
  {
    path: "/personal-course",        
    element: <PersonalCourse />, 
  },
  {
    name: "Cộng đồng",
    href: "https://www.material-tailwind.com/docs/react/installation",
    target: "_blank",
    element: "",
  },
  {
    name:"Khóa học của tôi",
    path: "/my-course",
    element: <MyCourse />, 
  },
];

export default routes;
