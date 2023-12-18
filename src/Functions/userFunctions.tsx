import { DocumentData, DocumentReference, addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { auth, cookies, db } from "../Components/fire"
import { v4 as uuid } from "uuid"
import { ROOM_COL, USER_COOKIE } from "../Exports/types"


export const addUser = async (user : string | null) => {
    addDoc(collection(db, "users"), {
        id : uuid(),
        user: user,
        chats: []
    })
    return
}

export const g_allUsers = async () => {

    const queryUsers = query(collection(db, "users"))
    const users : DocumentData[] = []

    getDocs(queryUsers)
    .then((result) => {
        result.docs.forEach((doc) => users.push(doc))
    })
    .catch((error : Error) => {
        console.log(error)
    })


    return users
}

export const inviteUser = async (room : string, user : string) => {
    addDoc(collection(db, "invites"), {
        inviter : cookies.get(USER_COOKIE),
        acceptor : user,
        room : room
    })

}

export const acceptInvite =async (id : string, inviteid: DocumentReference) => {
    //query to get room
    const room = query(collection(db, ROOM_COL), where("title", "==", id))

    const user = query(collection(db, "users"), where("user", "==", cookies.get(USER_COOKIE)))

    //find room to add too
    await getDocs(room).then( async (result) => {
            const ref = doc(db, ROOM_COL,  result.docs.at(0)!.id.toString());
            await updateDoc(ref, {
                users: arrayUnion(cookies.get(USER_COOKIE))
            })
            const inviteRef = doc(db, "invites", inviteid.toString())
            deleteDoc(inviteRef)
    })

    await getDocs(user).then(async (result) => {
            const ref = doc(db, "users", result.docs.at(0)!.id.toString());
            await updateDoc(ref, {
                chats : arrayUnion(id)
            })
    })


    return
}

export const g_Inviter = async (room : string) => {
    const queryInvites = query(collection(db, "invites"), where("inviter", "==", cookies.get(USER_COOKIE)), where("room", "==", room));
    const docsSnap = await getDocs(queryInvites)
    const list : string[] = docsSnap.docs.map((doc) => {
        return doc.data().acceptor})
    return list
}

export const inList = (list : string[], user : string | null | undefined) => {
    if (user)
        return list?.includes(user)
}