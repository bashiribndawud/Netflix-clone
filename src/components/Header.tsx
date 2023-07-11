import React, { useEffect, useState } from "react";
import netFlixLogo from "../assets/Netflix_Logo_RGB.png";
import Notification from "@heroicons/react/24/outline/BellIcon";
import { NavLink, Link } from "react-router-dom";
import SearchBar from "./search-bar";
import ProfileMenu from "./profile-menu";

export default function Header() {
  const [fixed, setFixed] = useState(false);
  function isActiveLink({ isActive }: { isActive: boolean }) {
    return isActive ? "font-semibold text-white" : undefined;
  }
  function onWindowScroll() {
    if (window.scrollY > 8) {
      setFixed(true);
    } else {
      setFixed(false);
    }
  }
  useEffect(() => {
    window.addEventListener("scroll", onWindowScroll);
    // whenever the component onmount
    () => window.removeEventListener("scroll", onWindowScroll);
  }, []);

  return (
    <header
      className={`z-10 py-2 pr-16 ${
        fixed ? "fixed top-0 bg-dark" : "relative bg-transparent"
      } w-full transition-colors duration-300 ease-linear`}
    >
      <nav className="grid grid-cols-[200px_auto_auto] items-center gap-4">
        <section className="h-12">
          <Link to="/browse">
            <img
              src={netFlixLogo}
              alt="Netflix Logo"
              className="h-full w-full object-contain"
            />
          </Link>
        </section>
        <section className="text-base font-normal text-gray-300">
          <ul className="flex gap-8">
            <li>
              <NavLink to="/browse" className={isActiveLink}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/browse/genre" className={isActiveLink}>
                TV Shows
              </NavLink>
            </li>
            <li>
              <NavLink to="/browse/genre/movies" className={isActiveLink}>
                Movies
              </NavLink>
            </li>
            <li>
              <NavLink to="/latest" className={isActiveLink}>
                News & Popular
              </NavLink>
            </li>
          </ul>
        </section>
        <section className="flex items-center gap-4 justify-self-end">
          <SearchBar />
          <Notification className="h-6 w-6" />
          <ProfileMenu />
        </section>
      </nav>
    </header>
  );
}
