import {
  MenuOutlined,
  BellOutlined,
  SettingOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const Header = ({ onMenuClick, notificationCount = 3 }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="relative !bg-[#081028] backdrop-blur-xl shadow-lg border-b border-white/20 h-18 flex items-center justify-between px-6 sticky top-0 z-40 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl -translate-x-16 -translate-y-16"></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-pink-500/10 rounded-full blur-2xl translate-x-12 -translate-y-12"></div>

      <div className="relative z-10 flex items-center justify-between gap-6 flex-1">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-3 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 border border-transparent hover:border-blue-500/20"
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
          >
            <MenuOutlined className="text-slate-700 text-lg" />
          </button>

          <div className="flex items-center justify-center  gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-20 animate-pulse"></div>
            </div>
            <div className="hidden sm:block mt-3">
              <h1 className=" text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-white">
                Admin Dashboard
              </h1>
               
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden">
          <div className="relative w-full group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center">
              <SearchOutlined className="absolute left-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-xl border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-300 text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search button for mobile */}
          

          {/* Notifications */}
       

          

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-3 p-2 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 border border-transparent hover:border-blue-500/20 group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">U</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-800">
                  Admin User
                </p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">U</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        Admin User
                      </p>
                      <p className="text-sm text-slate-500">
                        admin@example.com
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100/50 transition-colors duration-200 text-left">
                    <UserOutlined className="text-slate-500" />
                    <span className="text-slate-700">Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100/50 transition-colors duration-200 text-left">
                    <SettingOutlined className="text-slate-500" />
                    <span className="text-slate-700">Account Settings</span>
                  </button>
                  <hr className="my-2 border-slate-200/50" />
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors duration-200 text-left group">
                    <LogoutOutlined className="text-slate-500 group-hover:text-red-500" />
                    <span className="text-slate-700 group-hover:text-red-600">
                      Sign Out
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside handler for profile dropdown */}
      {profileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;