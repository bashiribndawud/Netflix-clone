import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import PlusCircle from "@heroicons/react/24/solid/PlusCircleIcon";
import Modal from "./modal";
import {
  useProfileContext,
  useProfileDispatchContext,
} from "../common/profile-context";
import { ActionType, UserProfile } from "../common/types";

export default function Profiles({ edit }: { edit: boolean }) {
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const userProfiles = useProfileContext();

  const dispatch = useProfileDispatchContext() as React.Dispatch<ActionType>;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const heading = !edit ? "Who's watching" : "Manage Profile";
  const navigate = useNavigate();
  function manageProfiles() {
    navigate("/ManageProfiles");
  }
  function closeEditor() {
    setIsProfileEditorOpen(false);
  }
  function openEditor() {
    setIsProfileEditorOpen(true);
  }
  function onProfileClick(profile: UserProfile) {
    dispatch({ type: "current", payload: profile });
    navigate("/browse");
  }
  // imageUrl: `/profile-${(userProfiles?.profiles?.length ?? 0) + 1}.png`,
    function onAddProfile() {
      const newProfile: UserProfile = {
        id: "",
        name: "",
        imageUrl: `/public/profile-0.png`,
      };
      setProfile(newProfile);
      openEditor();
    };
  function onEditProfile(profile: UserProfile) {
    setProfile(profile);
    openEditor;
  }

  function onSaveProfile(profile: UserProfile) {
    const action: ActionType = {
      type: profile.id ? "edit" : "add",
      payload: profile,
    };
    dispatch(action);
    setIsProfileEditorOpen(false);
  }

  function onDeleteProfile(profile: UserProfile) {
    dispatch({ type: "delete", payload: profile });
    setIsProfileEditorOpen(false);
  }
  return (
    <>
      <h1 className="mb-8 text-5xl">{heading}</h1>
      <section className="flex gap-4">
        {userProfiles?.profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            onProfileClick={onProfileClick}
            profile={profile as UserProfile}
            onEditClick={openEditor}
            edit={edit}
          />
        ))}
        {userProfiles?.profiles.length ?? 0 <= 3 ? (
          <AddProfile onAddProfile={onAddProfile} />
        ) : null}
      </section>
      {profile ? (
        <EditProfile
          edit={edit}
          isOpen={isProfileEditorOpen}
          title=""
          onClose={closeEditor}
          profile={profile}
          onSave={onSaveProfile}
          onDelete={onDeleteProfile}
        />
      ) : null}
      {edit ? (
        <>
          <ProfileButton className="mt-8" onClick={() => navigate("/")}>
            Done
          </ProfileButton>
        </>
      ) : (
        <ProfileButton
          onClick={manageProfiles}
          className="mt-8"
          buttonType="secondary"
        >
          Manage Profile
        </ProfileButton>
      )}
    </>
  );
}

function ProfileButton({
  buttonType = "primary",
  ...props
}: {
  buttonType?: "primary" | "secondary";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`${
        buttonType === "primary"
          ? "bg-gray-100 text-dark hover:bg-netflixRed hover:text-white"
          : "border border-white text-gray-400 hover:text-white"
      } mt-2 rounded-md py-2 px-4 text-xl ${props.className}`}
    >
      {props.children}
    </button>
  );
}

function ProfileCard({
  edit,
  onEditClick,
  profile,
  onProfileClick,
}: {
  edit: boolean;
  onEditClick: (profile: UserProfile) => void;
  profile: UserProfile;
  onProfileClick: (profile: UserProfile) => void;
}) {
  function editClick(event: React.SyntheticEvent) {
    event.stopPropagation();
    onEditClick(profile);
  }
  const { id, imageUrl, name } = profile;
  return (
    <section
      id=""
      className="flex cursor-pointer flex-col place-items-center gap-2 text-gray-400 hover:text-white"
      onClick={() => onProfileClick(profile)}
    >
      <section className="relative h-[10vw] max-h-[200px]  w-[10vw] min-w-[84px] max-w-[200px] overflow-hidden rounded-md hover:border-4 hover:border-gray-100">
        <img src={imageUrl} alt={name} />
        {edit ? (
          <button
            className="absolute inset-0 grid place-items-center bg-black/50"
            onClick={() => onEditClick(profile)}
          >
            <PencilIcon className="w-[25%] text-white" />
          </button>
        ) : null}
      </section>
      <h1 className="text-xl ">{name}</h1>
    </section>
  );
}

function AddProfile({ onAddProfile }: { onAddProfile: () => void }) {
  return (
    <section className="flex cursor-pointer flex-col place-items-center gap-2 text-gray-400">
      <button
        onClick={onAddProfile}
        className="relative grid h-[10vw] max-h-[200px] w-[10vw] min-w-[84px] max-w-[200px] place-items-center overflow-hidden rounded-md hover:border-4 hover:border-gray-100 hover:bg-gray-400 hover:text-white"
      >
        <PlusCircle className="w-[75%]" />
      </button>
    </section>
  );
}

function EditProfile(props: {
  isOpen: boolean;
  onClose: (value: boolean) => void;
  title: string;
  edit?: boolean;
  profile: UserProfile;
  onSave?: (profile: UserProfile) => void;
  onDelete: (profile: UserProfile) => void;
}) {
  const heading = props.profile.id ? "Edit Profile" : "Add Profile";
  function cancelEdit() {
    props.onClose(false);
  }
  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const { profileName } = event.target as typeof event.target & {
      profileName: HTMLInputElement;
    };
    if (props.onSave) {
      let profile = {
        name: profileName.value,
        id: props?.profile.id,
        imageUrl: props?.profile.imageUrl,
      };
      props.onSave(profile);
    }
  }
  return (
    <Modal {...props}>
      <section className="h-screen w-screen">
        <form onSubmit={onSubmit} className=" mx-auto my-16 max-w-4xl">
          <h1 className="mb-4 text-6xl">{heading}</h1>
          <section className="grid grid-cols-[200px_auto] gap-4 border-t p-4 text-gray-400">
            <section className="aspect-square overflow-hidden rounded-md">
              <img src="/public/netflix-profile.png" alt={props.profile.name} />
            </section>
            <section>
              <input
                defaultValue={props.profile.name}
                type="text"
                name="profileName"
                id="profileName"
                placeholder="Enter name for the profile"
                className="w-full rounded-md bg-zinc-500 p-2 text-gray-100 outline-none"
              />
            </section>
          </section>
          <section className="mt-8 flex gap-4">
            <ProfileButton type="submit">Save</ProfileButton>
            {props.profile.id ? (
              <ProfileButton
                buttonType="secondary"
                type="button"
                onClick={() => props?.onDelete(props.profile)}
              >
                Delete Profile
              </ProfileButton>
            ) : null}
            <ProfileButton
              type="button"
              buttonType="secondary"
              onClick={cancelEdit}
            >
              Cancel
            </ProfileButton>
          </section>
        </form>
      </section>
    </Modal>
  );
}
