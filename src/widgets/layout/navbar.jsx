import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar as MTNavbar,
  Typography,
  Button,
  IconButton,
  Collapse,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

export function Navbar({ brandName, routes }) {
  const [openNav, setOpenNav] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/authentication", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.isAuthenticated && data.authenticatedUser) {
            setUser(data.authenticatedUser);
            localStorage.setItem("user", JSON.stringify(data.authenticatedUser));
          } else {
            setUser(null);
            localStorage.removeItem("user");
          }
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };

    const handleResize = () => window.innerWidth >= 960 && setOpenNav(false);
    updateCart();

    window.addEventListener("resize", handleResize);
    window.addEventListener("storage", updateCart);
    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "http://localhost:8000/logout";
  };

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 text-inherit lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {routes
        .filter((route) => route.name)
        .map(({ name, path, icon, href, target }) => (
          <Typography
            key={name}
            as="li"
            variant="small"
            color="inherit"
            className="capitalize"
          >
            {href ? (
              <a
                href={href}
                target={target}
                className="flex items-center gap-1 p-1 font-semibold hover:text-pink-200 transition-all"
              >
                {icon &&
                  React.createElement(icon, {
                    className: "w-[18px] h-[18px] opacity-75 mr-1",
                  })}
                {name}
              </a>
            ) : (
              <Link
                to={path}
                target={target}
                className="flex items-center gap-1 p-1 font-semibold hover:text-pink-200 transition-all"
              >
                {icon &&
                  React.createElement(icon, {
                    className: "w-[18px] h-[18px] opacity-75 mr-1",
                  })}
                {name}
              </Link>
            )}
          </Typography>
        ))}
    </ul>
  );

  return (
    <MTNavbar color="transparent" className="p-3">
      <div className="container mx-auto flex items-center justify-between text-white max-w-7xl">
        {/* Logo */}
        <Link to="/home">
          <Typography className="mr-4 ml-2 cursor-pointer py-1.5 font-bold text-lg">
            {brandName}
          </Typography>
        </Link>

        {/* Menu center */}
        <div className="hidden lg:flex flex-1 justify-center">{navList}</div>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Cart */}
          <button
            onClick={() => navigate("/payment")}
            className="relative flex items-center hover:text-pink-300 transition"
          >
            <ShoppingCartIcon className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {/* Bell */}
              <button
                className="relative hover:text-pink-200 transition"
                onClick={() =>
                  alert("🔔 Chức năng thông báo đang được phát triển!")
                }
              >
                <BellIcon className="w-6 h-6" />
              </button>

              {/* User Dropdown */}
              <Menu placement="bottom-end">
                <MenuHandler>
                  <div className="flex items-center gap-2 cursor-pointer p-1.5 rounded-full hover:bg-pink-100/20 transition">
                    <Avatar
                      variant="circular"
                      size="sm"
                      alt={user.username}
                      className="border border-gray-200 shadow-sm"
                      src="/icon/teacher1.png"
                    />
                    <span className="font-semibold text-white">
                      {user.username}
                    </span>
                    <i className="fa-solid fa-chevron-down text-xs opacity-70"></i>
                  </div>
                </MenuHandler>
                <MenuList className="p-2 bg-white shadow-xl border border-gray-100 rounded-xl w-60">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="font-semibold text-gray-800">
                      {user.username}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email || "Không có email"}
                    </p>
                  </div>

                  <MenuItem
                    onClick={() => navigate("/personal-course")}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-pink-50 transition"
                  >
                    <i className="fa-solid fa-book-open text-pink-600"></i>
                    <span className="font-medium text-gray-700">
                      Khóa học của tôi
                    </span>
                  </MenuItem>

                  <MenuItem
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-pink-50 transition"
                  >
                    <i className="fa-solid fa-user text-pink-600"></i>
                    <span className="font-medium text-gray-700">
                      Hồ sơ cá nhân
                    </span>
                  </MenuItem>

                  <hr className="my-2 border-gray-100" />

                  <MenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                  >
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <span className="font-medium">Đăng xuất</span>
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          ) : (
            <a href="http://localhost:8000/oauth2/authorization/keycloak">
              <Button
                variant="gradient"
                size="sm"
                fullWidth
                className="bg-pink-600 hover:bg-pink-700"
              >
                Đăng nhập / Đăng ký
              </Button>
            </a>
          )}
        </div>

        {/* Mobile menu button */}
        <IconButton
          variant="text"
          size="sm"
          color="white"
          className="ml-auto text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>

      {/* Mobile dropdown */}
      <Collapse
        open={openNav}
        className="rounded-xl bg-white px-4 pt-2 pb-4 text-blue-gray-900 lg:hidden"
      >
        <div className="container mx-auto">
          {navList}

          <button
            onClick={() => navigate("/payment")}
            className="relative flex items-center mt-4"
          >
            <ShoppingCartIcon className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
          {user ? (
            <div className="mt-4 flex flex-col items-start gap-2">
              <button
                className="relative flex items-center gap-2 hover:text-blue-600 transition"
                onClick={() => alert("Chức năng thông báo đang được phát triển!")}
              >
                <BellIcon className="w-6 h-6 text-gray-700" />
                <span className="font-semibold">
                  Xin chào, {user.username}
                </span>
              </button>

              <Button
                variant="outlined"
                size="sm"
                color="blue"
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </div>
          ) : (
            <a
              href="http://localhost:8000/oauth2/authorization/keycloak"
              className="w-full block mt-4"
            >
              <Button variant="gradient" size="sm" fullWidth>
                Đăng nhập / Đăng ký
              </Button>
            </a>
          )}
        </div>
      </Collapse>
    </MTNavbar>
  );
}

Navbar.defaultProps = {
  brandName: "J-Hajime",
};

Navbar.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Navbar.displayName = "/src/widgets/layout/navbar.jsx";

export default Navbar;
