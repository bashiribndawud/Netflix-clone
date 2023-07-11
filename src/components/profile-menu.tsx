import React, { useEffect, useRef, useState } from "react";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import ProfileImage from "/netflix-profile.png";
import { useAuth } from "../firebase/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  useProfileContext,
  useProfileDispatchContext,
} from "../common/profile-context";
import { UserProfile } from "firebase/auth";
import { ActionType } from "../common/types";
export default function ProfileMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const ProfileMenuContainer = useRef<HTMLElement>(null);
  const timerId = useRef(0);
  const userProfiles = useProfileContext();
  const dispatch = useProfileDispatchContext();
  const currentProfile = userProfiles?.profiles.find(
    (profile) => profile.id === userProfiles.selectedProfileId
  );

   
   function onMouseEnter() {
     if (timerId.current) {
       clearTimeout(timerId.current);
     }
     setShowMenu(true);
   }
  function onMouseExit() {
    timerId.current = setTimeout(() => {
      setShowMenu(false);
    }, 300);
  }

  useEffect(() => {
    ProfileMenuContainer.current?.addEventListener("mouseenter", onMouseEnter);
    ProfileMenuContainer.current?.addEventListener("mouseleave", onMouseExit);
    return () => {
      ProfileMenuContainer.current?.removeEventListener(
        "mouseenter",
        onMouseEnter
      );
      ProfileMenuContainer.current?.removeEventListener(
        "mouseleave",
        onMouseExit
      );
    };
  }, []);

  async function signOutNetflix() {
    await signOut();
    dispatch({type: "load", payload: null});
    navigate("/login");
  }
  function loadProfile(profile: UserProfile) {
    dispatch({ type: "current", payload: profile });
    window.location.reload();
  }

  return (
    <>
      <section ref={ProfileMenuContainer} className="relative">
        <section className="flex items-center gap-2">
          <img
            className="h-8 w-8 rounded-sm"
            src={currentProfile?.imageUrl}
            alt={currentProfile?.name}
          />
          <ChevronDownIcon
            style={{ strokeWidth: ".2rem" }}
            className={`h-6 w-6 transition-transform duration-200 ${
              showMenu ? "rotate-180" : ""
            }`}
          />
        </section>
        {showMenu ? (
          <ul className="absolute -left-20 top-[50px] flex w-[200px] flex-col justify-center gap-4 rounded-md bg-dark px-4 py-2">
            {userProfiles?.profiles
              .filter((profile) => profile.id === currentProfile?.id)
              ?.map((profile) => (
                <li
                  className="flex cursor-pointer items-center gap-2 hover:underline"
                  key={profile.id}
                  onClick={() => loadProfile(profile)}
                >
                  <img
                    className="h-8 w-8 "
                    src={profile.imageUrl}
                    alt={profile.name}
                  />{" "}
                  {profile.name}
                </li>
              ))}
            <li
              className={
                (userProfiles?.profiles.length ?? 0) > 1
                  ? "border-t border-t-gray-500 px-4 pt-2"
                  : ""
              }
            >
              <Link to="/ManageProfiles" className="hover:underline ml-0">
                Manage Profile
              </Link>
            </li>
            <li>Transfer Profile</li>
            <li>Account</li>
            <li>Help Center</li>
            <li
              onClick={signOutNetflix}
              className="cursor-pointer border-t border-t-gray-500 px-4 pt-2 hover:underline"
            >
              Sign out of Netflix
            </li>
          </ul>
        ) : null}
      </section>
    </>
  );
}
