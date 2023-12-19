import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import { collection, onSnapshot, query, where, DocumentData, orderBy } from "firebase/firestore";
import { db, cookies } from "./fire";
import { v4 as uuid } from "uuid";
import '../css/Chat.css';
import { createMessage } from "../Functions/chatFunctions";
import { GeneralButton } from "../Material/MaterialCustoms";
import { IconButton, Input, TextField, ThemeProvider } from "@mui/material";
import { ChatItem } from "./ChatItem";
import { USER_COOKIE } from "../Exports/types";
import { FontTheme } from "../Material/MaterialThemes";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
            <div>
                <GeneralButton onClick={handleLeaving}>leave</GeneralButton>
            </div>
            <div className="chat-center-container">
                <div className="messages-chat-list" id="scroller">
                    {
                        messages.map((m: DocumentData) => {
                            return (
                                <div className={((cookies.get(USER_COOKIE) == m.user)) ? "chat-item-container-self" : "chat-item-container-other"} key={uuid()}>
                                    <ChatItem message={m.text} username={m.user} self={(cookies.get(USER_COOKIE) == m.user)} />
                                </div>
                            )
                        })
                    }
                </div>
                <form className="new-message">
                    <ThemeProvider theme={FontTheme}>
                        <TextField
                            sx={{
                                '.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                },

                                '.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: "darkgreen",
                                }
                            }} className="new-message-input" value={newMessage} onChange={(e) => { setNewMessage(e.target.value) }} size="small" />
                        <IconButton sx={{
                            svg: {
                                color: 'darkgreen'
                            }
                        }} onClick={handleSubmit} type="submit" className="send-button">
                            <ArrowForwardIcon />
                        </IconButton>
                    </ThemeProvider>
                </form>
            </div>
        </div>
    )
}

export default Chat;