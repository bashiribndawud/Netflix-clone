// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlbWQ5Vywa-cr8BpLXPvyJJz8Shv_vqlM",
  authDomain: "devsnest-netflix-clone.firebaseapp.com",
  projectId: "devsnest-netflix-clone",
  storageBucket: "devsnest-netflix-clone.appspot.com",
  messagingSenderId: "631332054450",
  appId: "1:631332054450:web:c270ca3abc510b8369f0ab",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initailize firebase Authentication
const auth = getAuth(app);

type Props = {
  children: ReactNode;
};
export type AuthContextType = ReturnType<typeof useAuthProvider>

const AuthContext = createContext<AuthContextType | null>(null);



export const AuthProvider = ({children} : {children: React.ReactElement| React.ReactElement[]}) =>{
    const auth = useAuthProvider();
    return <AuthContext.Provider value={auth}>
        {children}
    </AuthContext.Provider>
}


// custom hook
function useAuthProvider() {
    // current user is null when
    // 1. firebase is still fetching the information async operation
    // 2. When the user is logged out


    // when user is logged the user state is set
    const [user, setUser] = useState<User | null>(auth.currentUser)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        // detect if there are any changes to the user object/ update user if there is any change
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setLoading(false)
          setUser(user);
        });

        return () => {
          unsubscribe()
        }
    }, [])

    const signUp = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password).then(({user}) => {
        return user
    })

    const signIn = (email:string, password:string) => signInWithEmailAndPassword(auth, email, password).then(({user}) => {
        return user
    })

    const signOutUser = () => signOut(auth)

    return {
      signIn,
      signUp,
      signOut: signOutUser,
      user,
      loading
    };
}


// hook to use the context

export const useAuth = () => useContext(AuthContext) ?? {} as AuthContextType;



