import React, { FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NetflixLogo from "../assets/Netflix_Logo_RGB.png";
import { useAuth } from "../firebase/auth";

export default function Register() {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    const { email, password } = event.target as typeof event.target & {
      email: HTMLInputElement;
      password: HTMLInputElement;
    };
    const user = await signUp(email.value, password.value);
    if (user) {
      navigate("/login");
    }
  }
//   useEffect(() => {
//     if (user) {
//       navigate("/");
//     }
//   }, [user]);

  return (
    <>
      <header className="w-56">
        <img
          className="relative z-[1] h-full w-full"
          src={NetflixLogo}
          alt="Netflix Logo Icon"
        />
      </header>
      <main>
        <section
          className={`absolute top-0 -z-[1] min-h-screen w-full bg-[url('/background.jpg')] bg-cover `}
        ></section>

        <section className="absolute inset-0 bg-gradient-to-b from-zinc-900/50"></section>

        <form
          onSubmit={handleSubmit}
          className="relative mx-auto  w-[400px] rounded-lg bg-black/75 p-16"
        >
          <article className="text-gray-300 ">
            <h1 className="mb-4 text-4xl text-white">Sign Up</h1>
            <section className="flex flex-col gap-4">
              <input
                type="email"
                name="email"
                id="email"
                className="rounded-md bg-zinc-500 p-2 text-white outline-none focus:outline-none"
                autoComplete="off"
                placeholder="Enter username"
              />
              <input
                type="password"
                name="password"
                id="password"
                className="rounded-md bg-zinc-500 p-2 text-white outline-none focus:outline-none"
                placeholder="Enter password"
              />
              <button className="my-8 rounded-md bg-netflixRed p-2 font-semibold">
                Sign Up
              </button>
            </section>
            <p>
              Aleady have an account?{" "}
              <Link className="text-white" to="/login">
                Sign In Now
              </Link>
            </p>
          </article>
        </form>
      </main>
    </>
  );
}
