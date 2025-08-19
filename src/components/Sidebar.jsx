import React from "react";
import {
  UserOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";

const Sidebar = ({ isMobile = false, onClose }) => {
  const navigate = useNavigate();

  const user_info = Cookies.get("usmle_user_info");
  const user = JSON.parse(user_info);

  const allMenuItems = [
    {
      href: "/dashboard",
      icon: <UserOutlined className="text-xl" />,
      label: "User Management",
      roles: ["admin", "user"],
    },
    {
      href: "/dashboard/add-subject",
      icon: <ShoppingOutlined className="text-xl" />,
      label: "Subjects",
      roles: ["admin", "user"],
    },
    {
      href: "/dashboard/add-question",
      icon: <QuestionCircleOutlined className="text-xl" />,
      label: "Questions",
      roles: ["admin", "user"],
    },
    {
      href: "/dashboard/add-system",
      icon: <QuestionCircleOutlined className="text-xl" />,
      label: "Add System",
      roles: ["admin", "user"],
    },
    {
      href: "/dashboard/create-quiz",
      icon: <QuestionCircleOutlined className="text-xl" />,
      label: "Quiz List",
      roles: ["user", "admin"],
    },
    {
      href: "/dashboard/advance-quiz",
      icon: <QuestionCircleOutlined className="text-xl" />,
      label: "Create Quiz",
      roles: ["user", "admin"],
    },
  ];

  const filteredMenu = allMenuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const handleSignOut = () => {
    Cookies.remove("usmle_token");
    Cookies.remove("usmle_user_info");
    navigate("/");
  };

  return (
    <aside
      className={`${
        isMobile ? "w-full" : "w-72"
      } h-full bg-[#081028] text-white shadow-2xl relative overflow-hidden`}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-500 to-pink-500 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-4 mb-10">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <p className="text-xs text-slate-400 mt-1">Management Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-3 flex-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
            Navigation
          </div>
          {filteredMenu.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              onClick={isMobile ? onClose : undefined}
              className="group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-[1.02] backdrop-blur-sm border border-transparent hover:border-white/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 rounded-2xl"></div>

              <div className="relative flex items-center gap-4 w-full">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300">
                  <span className="text-slate-400 group-hover:text-blue-400 transition-colors duration-300">
                    {item.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-slate-200 group-hover:text-white transition-colors duration-300 block">
                    {item.label}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="relative mt-auto mb-6">
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-xl">
            <button
              onClick={handleSignOut}
              className="w-full mt-4 flex items-center justify-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 transition-all duration-300 group"
            >
              <LogoutOutlined className="text-sm text-slate-400 group-hover:text-red-400 transition-colors duration-300" />
              <span className="text-xs font-medium text-slate-400 group-hover:text-red-400 transition-colors duration-300">
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
