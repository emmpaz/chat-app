import { DocumentData, addDoc, collection, getDocs, query } from "firebase/firestore"
import { auth, cookies, db } from "../Components/fire";
import {v4 as uuid} from "uuid";
import { ROOM_COL } from "../Exports/types";

export const getRooms = async () => {

    //get rooms that exist
    const queryRooms = query(collection(db, ROOM_COL))
    const list: DocumentData[] = []
    try{
        await getDocs(queryRooms).then((result) => {
            result.forEach((doc) => {
                list.push(doc.data())
            })
        }
        );
    }catch(error: any){
        if (error.name == "AbortError") return;
    }
    
    
    return list

}

export const newRoom = async (room : string) => {
    //add a room
    await addDoc(collection(db, ROOM_COL), {
        id : uuid(),
        title : room
    })
    .then((result)=> {
        console.log("success: " + room)
        console.log(result)
        cookies.set("rooms", room)
    })
    .catch(()=> console.log("error adding: " + room))
    return 
}

