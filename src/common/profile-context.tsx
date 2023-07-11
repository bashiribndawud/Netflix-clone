import React, { createContext, useContext, useEffect, useReducer } from "react";
import { ActionType, UserProfile } from "./types";
import { useAuth } from "../firebase/auth";
import ProfilesReducer from "../reducer/profile-reducer";
import { ProfileContextType } from "./types";

type StoredProfiles = Map<string, ProfileContextType>;

const LOCAL_STORAGE_KEY = "profiles";
const ProfileContext = createContext<ProfileContextType | null>(null);

const ProfileDispatchContext = createContext<React.Dispatch<ActionType> | null>(
  null
);

export default function ProfileProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const { user } = useAuth();
  const userProfiles = findProfile(user?.email as string);
  const [state, dispatch] = useReducer(ProfilesReducer, userProfiles);
  useEffect(() => {
    if (user?.email) {
      if (state) {
        const storedProfiles = getProfiles();
        storedProfiles.set(user.email, state as ProfileContextType);
        updateProfiles(storedProfiles);
      } else {
        dispatch({ type: "load", payload: userProfiles });
      }
    }
  }, [user?.email, state]);

  return (
    <ProfileContext.Provider value={state}>
      <ProfileDispatchContext.Provider value={dispatch}>
        {children}
      </ProfileDispatchContext.Provider>
    </ProfileContext.Provider>
  );
}

function getProfiles() {
  return new Map(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]"));
}

function findProfile(id: string) {
  const profiles = getProfiles();
  return id ? profiles.get(id) ?? null : null;
}

function updateProfiles(profiles: StoredProfiles) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(profiles)));
}

export const useProfileContext = () => useContext(ProfileContext);
export const useProfileDispatchContext = () =>
  useContext(ProfileDispatchContext);
