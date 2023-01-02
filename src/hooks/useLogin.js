import {GithubAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../firebase/config";
import {useState} from "react";

import {db} from '../firebase/config';
import {collection, getDocs, setDoc, doc} from "firebase/firestore";

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
    const [rank, setRank] = useState(0);
    const [user, setUser] = useState(undefined);

    const provider = new GithubAuthProvider();

    const login = async (setLoggedIn) => {
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
            await set_profile()
            // get all user data from firestore
            const userRef = collection(db, "users");
            let i = 1;

            getDocs(userRef).then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        if (data.email === user.email)
                            setRank(i);
                        i++;
                    });
                }
            );
            setUser(user);

            console.log("added profile");
            // const docRef = getDoc(db, "users", user.uid);
            setIsPending(false);


        } catch (error) {
            console.log(error);
            setError(error.message);
            setIsPending(false);
        }
    };
    return {login, error, isPending, rank,user};
};