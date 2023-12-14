import { addDoc, collection, deleteDoc, getDocs, query, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../Components/fire";
import { MESSAGE_COL } from "../Exports/types";


export const createMessage = async (message : string, room: string) => {
    await addDoc(collection(db, MESSAGE_COL), {
        text: message,
        createdAt: serverTimestamp(),
        user: auth.currentUser?.displayName,
        room: room
    })
    .then(() => console.log("success messsage :" + message))
    .catch(() => console.log("error message: "+ message))
    
    return
    
}