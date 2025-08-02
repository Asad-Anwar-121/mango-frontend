import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Home, Leaf, MoreHorizontal } from "lucide-react"; // Icons

const Sidebar = () => {
  const { mangoData } = useContext(AppContext);

  const sidebarLinks = [
    { name: "Home", path: "/", icon: <Home /> },
    { name: "Disease", path: "/Disease", icon: <Leaf /> },
    { name: "More", path: "/More", icon: <MoreHorizontal /> },
  ];

  const filteredLinks = mangoData.status
    ? mangoData.status.toLowerCase() === "healthy"
      ? sidebarLinks.filter(link => link.name === "Home" || link.name === "More")
      : sidebarLinks
    : sidebarLinks.filter(link => link.name === "Home");

  return (

    <>
    
    <nav className="fixed bg-[#FFF8E1] top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4  shadow">

            <a href="/">
          <img src="/logo.jpg" alt="logo" className="w-18" />
            </a>

          

        </nav>
    <div className=" fixed top-[90px]  md:w-64 w-16 bg-[#FFF8E1] border-r h-[100vh] text-base border-yellow-300 pt-6  flex flex-col shadow-md transition-all duration-300">
     
     
      {filteredLinks.map((item) => (
        <NavLink
          to={item.path}
          key={item.name}
          end={item.path === "/"}
          className={({ isActive }) =>
            `flex items-center gap-4 py-3 px-4 rounded-r-full mx-2 my-1 transition-all duration-200 
            ${
              isActive
                ? "bg-amber-200 text-amber-800 font-semibold shadow-inner"
                : "hover:bg-yellow-100 text-gray-600"
            }`
          }
        >
          <span className="text-amber-700">{item.icon}</span>
          <span className="md:block hidden">{item.name}</span>
        </NavLink>
      ))}
    </div>
    </>
  );
};

export default Sidebar;
