import { getAdditionalUserInfo, signInWithPopup, signOut } from "firebase/auth";
import { auth, provider, cookies } from "./fire";

import { Dispatch, SetStateAction } from "react";
import { AUTH_COOKIE, USER_COOKIE } from "../Exports/types";

import "../css/Auth.css";
import { Button, ThemeProvider, styled} from "@mui/material";
import { FontTheme } from "../Material/MaterialThemes";
import { GeneralButton } from "../Material/MaterialCustoms";
import { addDoc, collection } from "firebase/firestore";
import { addUser } from "../Functions/userFunctions";

function Auth(props : {setAuth : Dispatch<SetStateAction<string>>, username: Dispatch<SetStateAction<string | null | undefined>>}) {

    //handle sign in with google and set cookies
    const handleSignIn = async () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result)
                cookies.set(AUTH_COOKIE, result.user.refreshToken)
                cookies.set(USER_COOKIE, result.user.displayName)
                props.setAuth(result.user.refreshToken)
                props.username(result.user.displayName)

                if(getAdditionalUserInfo(result)?.isNewUser){
                    addUser(result.user.displayName)
                }
                
            })
            .catch((error) => {
                console.log(error)
            })
    }
    //handling sign out
    const handleSignOut = async () => {
        signOut(auth)
        .then((result) => {
            console.log(result)
            cookies.set(AUTH_COOKIE, "")
            cookies.set(USER_COOKIE, "")
            window.location.reload();
        })
        .catch((error) => {
            console.log(error)
        })
    }

    if(cookies.get(AUTH_COOKIE) === ""){
        return (
            <div className="auth-sign-in-container">
                <ThemeProvider theme={FontTheme}>
                <GeneralButton 
                    variant="text" 
                    onClick={handleSignIn}
                    size = "large"
                >sign in/sign up</GeneralButton>
                </ThemeProvider>
            </div>
        )
    }
    return(
        <div className="auth-sign-out-container">
            <ThemeProvider theme={FontTheme}>
                <GeneralButton onClick={handleSignOut}>sign out</GeneralButton>
            </ThemeProvider>
        </div>
    )
}

export default Auth;