import { DocumentData, addDoc, collection, getDocs, query } from "firebase/firestore"
import { auth, cookies, db } from "../Components/fire";
import { FormEvent , useDebugValue, useId} from "react";
import {v4 as uuid} from "uuid";
import { ROOM_COL } from "../Exports/types";

export const getRooms = async () => {
    const queryRooms = query(collection(db, "rooms"))
    const list: DocumentData[] = []

    await getDocs(queryRooms).then((result) => {
        result.forEach((doc) => {
            list.push(doc.data())
        })
    }
    );
    
    
    return list

}

export const newRoom = async (room : string) => {
    
    await addDoc(collection(db, ROOM_COL), {
        id : uuid(),
        title : room
    })
    .then(()=> {
        console.log("success: " + room)
        cookies.set("rooms", room)
    })
    .catch(()=> console.log("error adding: " + room))
    return 
}

