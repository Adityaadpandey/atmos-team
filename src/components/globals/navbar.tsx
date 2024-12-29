import { Home, User } from "lucide-react";
import { FloatingNav } from "../ui/floating-navbar";

const Navbar = () => {
  return (
    <FloatingNav
      navItems={[
        {
          name: "Home",
          link: "/",
          icon: <Home size={24} />,
        },
        {
          name: "About",
          link: "/about",
          icon: <User size={24} />,
        },
      ]}
    />
  );
};

export default Navbar;
