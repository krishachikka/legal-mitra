import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"; // Fixed import
import { app } from '../firebase'; // your initialized Firebase app

const auth = getAuth(app);

export const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
    return signOut(auth);
};

export const onAuthStateChangedListener = (callback) => {
    return onAuthStateChanged(auth, callback); // This should now work
};
