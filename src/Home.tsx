import Auth from './Components/Auth';
import { useState, useRef, useEffect } from 'react';
import Chat from './Components/Chat';
import { auth, cookies, db } from './Components/fire';
import { newRoom, getRooms } from './Functions/roomFunctions';
import { DocumentData, addDoc, collection } from 'firebase/firestore';
import {v4 as uuid} from "uuid";
import { AUTH_COOKIE, ROOM_COOKIE } from './Exports/types';

function Home() {

    const [isAuth, setIsAuth] = useState<string>(cookies.get(AUTH_COOKIE));
    const [room, setRoom] = useState<string | null>(cookies.get(ROOM_COOKIE))
    const [name, setName] = useState<string | null | undefined>(auth.currentUser?.displayName)
    const roomRef = useRef<HTMLInputElement>(null);

    const [roomList, setRoomList] = useState<DocumentData[]>([]);

    useEffect(() => {
        getRooms().then((result: DocumentData[]) => {
            setRoomList(result)
        })
    }, [])

    const handleNewRoom = async () => {
        if (!roomRef.current?.value) return;
        newRoom(roomRef.current.value)
        setRoom(roomRef.current.value)
    }

    if (!isAuth) {
        return (
            <div>
                <Auth setAuth={setIsAuth} username={setName} />
            </div>
        )
    }

    return (
        <div>
            {!room && roomList.map((r: DocumentData) => {

                return (
                    <div key={uuid()}>
                        <p key={uuid()} >{r.title}</p>
                        <button key={uuid()} onClick={() => { setRoom(r.title); cookies.set(ROOM_COOKIE, r.title) }}>Choose room</button>
                    </div>
                )

            })}
            {room ? <Chat room={room} roomsetting={setRoom} /> :
                (<div>
                    <label>New Room</label>
                    <input ref={roomRef} />
                    <button onClick={handleNewRoom}>Enter Chat</button>
                </div>)}
        </div>
    )
}

export default Home;
