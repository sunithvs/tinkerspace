import {GithubAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../firebase/config";
import {useState} from "react";
import {collection, addDoc,getDoc} from "firebase/firestore";
import {db} from '../firebase/config';

const add_profile = async () => {
    await addDoc(collection(db, "users"), {
        id: auth.currentUser.uid,
        name: auth.currentUser.displayName,
        profile_url: auth.currentUser.photoURL,
    });
}
export const useLogin = () => {
    const [error, setError] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const provider = new GithubAuthProvider();

    const login = async () => {
        setError(null);
        setIsPending(true);

        try {
            const res = await signInWithPopup(auth, provider);
            if (!res) {
                throw new Error("Could not complete signup");
            }

            const user = res.user;
            console.log(user);
            // await add_profile();
            // if already profile picture exists, then don't add it again
            setIsPending(false)
        } catch (error) {
            console.log(error);
            setError(error.message);
            setIsPending(false);
        }
    };

    return {login, error, isPending};
};