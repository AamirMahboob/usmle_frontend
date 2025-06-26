import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  // Example auth check (uncomment if needed)
  // const token = localStorage.getItem('usmle_token');
  // if (!token) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:block w-72 bg-[#081028]">
        <Sidebar />
      </div>

      {/* Main content wrapper */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;



// import React, { Suspense, useEffect, useState } from 'react';
// import { Outlet, Navigate, useLocation } from 'react-router-dom';
// import Header from '../components/Header';
// import Sidebar from '../components/Sidebar';
// import { Spin } from 'antd';

// const DashboardLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const location = useLocation();
//   useEffect(() => {
//     setMounted(true);
//   }, []);
 

//   const closeSidebar = () => setSidebarOpen(false);

//   // Optional auth protection (uncomment if needed)
//   const token = localStorage.getItem('usmle_token');
//   if (!token && location.pathname !== '/login') {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <div>
//       <Suspense fallback={<Spin size="large" className="h-screen flex items-center justify-center" />}>
//         <div className="flex flex-1 overflow-hidden">
//           <div className="hidden md:block relative">

//             <Sidebar />
//           </div>
//               {/* Sidebar (Mobile Overlay) */}
//              {/* {mounted && sidebarOpen && (
//               <div className="fixed inset-0 z-50 md:hidden">
//                 <div
//                   className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//                   onClick={closeSidebar}
//                 />
//                 <div className="relative w-80 h-full bg-[#081028]">
//                   <div className="absolute top-4 right-4 z-10">
//                     <button
//                       onClick={closeSidebar}
//                       className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors duration-200"
//                       aria-label="Close sidebar"
//                     >
//                       <CloseOutlined className="text-white text-lg" />
//                     </button>
//                   </div>
//                   <Sidebar isMobile={true} onClose={closeSidebar} />
//                 </div>
//               </div>
//             )} */}
//           <div className="flex flex-col w-full">
//             <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} notificationCount={3} />
//             <main className="p-4 overflow-auto flex-1">
//               <Outlet />
//             </main>

//           </div>
//         </div>



//         {/* <Outlet /> */}
//       </Suspense>
//     </div>
//   );
// };

// export default DashboardLayout;



// import React, { useState, useEffect, Suspense } from 'react';
// import { Outlet, Navigate, useLocation } from 'react-router-dom';
// import { ConfigProvider, Spin } from 'antd';
// import { CloseOutlined } from '@ant-design/icons';
// import Header from '../components/Header';
// import Sidebar from '../components/Sidebar';

// const DashboardLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const closeSidebar = () => setSidebarOpen(false);

//   // Optional auth protection (uncomment if needed)
//   const token = localStorage.getItem('usmle_token');
//   if (!token && location.pathname !== '/login') {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorPrimary: '#1677ff',
//         },
//       }}
//     >
//       <Suspense fallback={<Spin size="large" className="h-screen flex items-center justify-center" />}>
//         <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-gray-100">
//           <div className="flex flex-1 overflow-hidden">
//             {/* Sidebar (Desktop) */}
//             <div className="hidden md:block relative">
//               <Sidebar />
//             </div>

//             {/* Sidebar (Mobile Overlay) */}
//             {mounted && sidebarOpen && (
//               <div className="fixed inset-0 z-50 md:hidden">
//                 <div
//                   className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//                   onClick={closeSidebar}
//                 />
//                 <div className="relative w-80 h-full bg-[#081028]">
//                   <div className="absolute top-4 right-4 z-10">
//                     <button
//                       onClick={closeSidebar}
//                       className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors duration-200"
//                       aria-label="Close sidebar"
//                     >
//                       <CloseOutlined className="text-white text-lg" />
//                     </button>
//                   </div>
//                   <Sidebar isMobile={true} onClose={closeSidebar} />
//                 </div>
//               </div>
//             )}

//             {/* Main content */}
//             <div className="flex flex-col w-full">
//               <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} notificationCount={3} />
//               <main className="p-4 overflow-auto flex-1">
//                 <Outlet />
//               </main>
//             </div>
//           </div>
//         </div>
//       </Suspense>
//     </ConfigProvider>
//   );
// };

// export default DashboardLayout;
