import { DocumentData, addDoc, collection, getDocs, query, where } from "firebase/firestore"
import { auth, cookies, db } from "../Components/fire";
import {v4 as uuid} from "uuid";
import { ROOM_COL, USER_COOKIE } from "../Exports/types";
import { inList } from "./userFunctions";

export const getRooms = async () => {
    //get rooms that exist
    const queryRooms = query(collection(db, ROOM_COL))
    const list: DocumentData[] = []
    try{
        await getDocs(queryRooms).then((result : DocumentData) => {
            result.forEach((doc : DocumentData) => {
                const data = doc.data();
                console.log(data)
                if(data.creator === cookies.get(USER_COOKIE) || inList(data.users, cookies.get(USER_COOKIE)))
                    list.push(doc)
                
            })
        }
        );
    }catch(error: any){
        if (error.name == "AbortError") return;
    }
    
    
    return list
}

export const getInvitedto = async () => {
    const queryInvites = query(collection(db, "invites"), where("acceptor" , "==", cookies.get(USER_COOKIE)))
    try{
    const docs = await getDocs(queryInvites)
    const list : DocumentData[] = docs.docs.map((doc) => {
        return doc
    })
    return list
    }catch(error: any){
        console.log(error)
    }
    return []
}

export const newRoom = async (room : string, user : string) => {
    //add a room
    await addDoc(collection(db, ROOM_COL), {
        id : uuid(),
        title : room,
        creator: user
    })
    .then((result)=> {
        console.log("success: " + room)
        console.log(result)
        cookies.set("rooms", room)
    })
    .catch(()=> console.log("error adding: " + room))
    return 
}

