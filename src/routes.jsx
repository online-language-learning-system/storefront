
import Courses from "@/pages/Courses/Courses";
import Auth from "@/pages/Login-Register/Auth";
import Home from "@/pages/Home/Home.jsx";
import Profile from "@/pages/Profile/Profile";
import Payment from "@/pages/Payment/Payment";
import TryCourse from "@/pages/Courses/TryCourse";
import CourseDetail from "./pages/Courses/CourseDetail";
import PersonalCourse from "@/pages/Courses/PersonalCourse";
import MyCourse from "@/pages/Courses/MyCourse";

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
