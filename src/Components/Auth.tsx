import { signInWithPopup } from "firebase/auth";
import { auth, provider, cookies } from "./fire";

import Cookies from 'universal-cookie';
import { Dispatch, SetStateAction } from "react";
import { AUTH_COOKIE, USER_COOKIE } from "../Exports/types";


function Auth(props : {setAuth : Dispatch<SetStateAction<string>>, username: Dispatch<SetStateAction<string | null | undefined>>}) {
    const handleSignIn = async () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result)
                cookies.set(AUTH_COOKIE, result.user.refreshToken)
                cookies.set(USER_COOKIE, result.user.displayName)
                props.setAuth(result.user.refreshToken)
                props.username(result.user.displayName)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div>
            <button onClick={handleSignIn}>Sign in with Google</button>
        </div>
    )
}

export default Auth;