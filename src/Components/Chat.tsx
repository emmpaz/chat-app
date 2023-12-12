import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import { collection, onSnapshot, query, where, DocumentData, orderBy } from "firebase/firestore";
import { auth, db, cookies } from "./fire";
import {v4 as uuid} from "uuid";
import '../css/Chat.css';
import { createMessage } from "../Functions/chatFunctions";
import { GeneralButton } from "../Material/MaterialCustoms";
import { ThemeProvider } from "@emotion/react";
import { Input } from "@mui/material";


type ScrollContainer = {
    scrollTop?: number;
    scrollHeight?: number;
}

const Chat = (props: { room: string, roomsetting: Dispatch<SetStateAction<string | null>> }) => {

    //new message state
    const [newMessage, setNewMessage] = useState("");
    //list of messages from that chat room
    const [messages, setMessages] = useState<DocumentData[]>([])

    //query to get messages from respective chat rooms
    const queryMessages = query(collection(db, "messages"), where("room", "==", props.room), orderBy("createdAt"))
    //updates chat when new message is sent
    useEffect(() => {
        try {
            onSnapshot(queryMessages, (snapshot) => {
                const tmpList = snapshot.docs.map(item => item.data())
                setMessages([...tmpList])
            })
        } catch (error: any) {
            if (error.name === "AbortError") return;
        }
    }, [])
    //auto scroll to new message
    useEffect(() => {
        const container: ScrollContainer | null = document.getElementById("scroller");
        if (container)
            container.scrollTop = container.scrollHeight || 0;
    }, [messages])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (newMessage == "") return;

        createMessage(newMessage, props.room);
        
        setNewMessage("")
    }

    const handleLeaving = () => {
        props.roomsetting("")
        cookies.set("rooms", "")
    }

    return (
        <div className="chat-full-container">
            {props.room}
            <div>
                <GeneralButton onClick={handleLeaving}>leave</GeneralButton>
            </div>
            <div className="chat-center-container">
                <div className="messages-chat-list" id="scroller">
                    {
                        messages.map((m: DocumentData) => {
                            return (
                                <div className={(auth.currentUser?.displayName == m.user) ? "indepedent-message-self" : "indepedent-message-other"} key={uuid()}>
                                    <p key={uuid()}>{m.user}</p>
                                    <h3 key={uuid()}>{m.text}</h3>
                                </div>
                            )
                        })
                    }
                </div>
                <form className="new-message">
                    <Input className="new-message-input" value={newMessage} onChange={(e) => { setNewMessage(e.target.value) }} />
                    <GeneralButton onClick={handleSubmit} type="submit" className="send-button">Send</GeneralButton>
                </form>
            </div>
        </div>
    )
}

export default Chat;