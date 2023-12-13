import { DocumentData, Query, addDoc, collection, getDocs, query } from "firebase/firestore"
import { db } from "../Components/fire"
import { v4 as uuid } from "uuid"


export const addUser = async (user : string | null) => {
    addDoc(collection(db, "users"), {
        id : uuid(),
        user: user,
        chats: []
    })
    return
}

export const allUsers = async () => {
    const queryUsers = query(collection(db, "users"))
    const users : DocumentData[] = []
    getDocs(queryUsers)
    .then((result) => {
        result.docs.forEach((doc) => users.push(doc.data()))
    })
    .catch((error : Error) => {
        console.log(error)
    })
    return users
}