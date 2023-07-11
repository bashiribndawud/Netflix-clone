import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
// import "./App.css";
import Layout from "./components/Layout";
import Browse from "./pages/browse";
import Home from "./pages/home";
import Login from "./pages/login";
import { AuthProvider, useAuth } from "./firebase/auth";
import Profiles from "./pages/profile";
import Profile from "./pages/profile";
import ProfileProvider from "./common/profile-context";
import Register from "./pages/register";
import Loadder from "./components/loadder";

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  if (!user && !loading) {
    return <Navigate to="/login" />;
  }
  return children;
}

function ErrorRoute() {
  return (
    <article className="flex h-screen w-screen flex-col items-center justify-center gap-3">
      <h1 className="text-4xl text-netflixRed">
        Opps!!! The page you are looking for does not exit
      </h1>
      <p className="mt-0 text-2xl rounded-sm">
        Browse more content{" "}
        <Link to="/browse" className="bg-gray-200 text-netflixRed px-2">
          here
        </Link>{" "}
      </p>
    </article>
  );
}

function AppRouter() {
  const { loading, user } = useAuth();
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }
          errorElement={<ErrorRoute />}
        >
          <Route index element={<Profile />} />
          <Route path="ManageProfiles" element={<Profile edit />} />
          <Route path="browse" element={<Layout />}>
            <Route index element={<Browse />} />
          </Route>
          <Route path="latest" element={<Layout />}>
            <Route index element={<h1>latest</h1>} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
      </>
    )
  );
  return loading ? <Loadder /> : <RouterProvider router={router} />;
}

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AppRouter />
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
