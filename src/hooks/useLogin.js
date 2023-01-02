import {GithubAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../firebase/config";
import {useState} from "react";
import {collection, addDoc, setDoc, doc} from "firebase/firestore";

import {db} from '../firebase/config';

const add_profile = async () => {
    try {
        await addDoc(collection(db, "users"), {
            id: auth.currentUser.uid,
            name: auth.currentUser.displayName,
            profile_url: auth.currentUser.photoURL,
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}
const set_profile = async () => {
    try {
        await setDoc(doc(db, "users", auth.currentUser.uid), {
            name: auth.currentUser.displayName,
            profile_url: auth.currentUser.photoURL,
            email: auth.currentUser.email,
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}
export const useLogin = () => {

    const [error, setError] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const provider = new GithubAuthProvider();

    const login = async () => {
        console.log("login")
        setError(null);
        setIsPending(true);

        try {
            const res = await signInWithPopup(auth, provider);
            if (!res) {
                throw new Error("Could not complete signup");
            }
            const user = res.user;
            console.log(user);
            // read user data from firestore
            // const userRef = collection(db, "users");
            await set_profile();
            console.log("added profile");
            // const docRef = getDoc(db, "users", user.uid);
            setIsPending(false)
        } catch (error) {
            console.log(error);
            setError(error.message);
            setIsPending(false);
        }
    };

    return {login, error, isPending};
};