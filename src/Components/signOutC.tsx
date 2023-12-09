import { signOut } from "firebase/auth";
import { auth } from "./fire";

const signOuC = () =>{

    const handleSignOut = async () => {
        signOut(auth)
        .then((result) => {
            console.log(result)
        })
        .catch((error) => {
            console.log(error)
        })
    }
    return(
        <button onClick={handleSignOut}></button>
    )
}

export default signOuC;