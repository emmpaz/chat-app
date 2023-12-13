import Auth from './Components/Auth';
import { useState, useRef, useEffect } from 'react';
import Chat from './Components/Chat';
import { auth, cookies } from './Components/fire';
import { newRoom, getRooms } from './Functions/roomFunctions';
import { DocumentData } from 'firebase/firestore';
import { AUTH_COOKIE, ROOM_COOKIE, USER_COOKIE } from './Exports/types';
import "./css/Home.css";
import { Button, FormLabel, Input, ThemeProvider, Typography } from '@mui/material';
import RoomItem from './Components/RoomItem';
import { v4 as uuid } from 'uuid';
import { FontTheme } from './Material/MaterialThemes';
import { GeneralButton } from './Material/MaterialCustoms';
import { allUsers } from './Functions/userFunctions';

function Home() {

    const [isAuth, setIsAuth] = useState<string>(cookies.get(AUTH_COOKIE));
    const [room, setRoom] = useState<string | null>(cookies.get(ROOM_COOKIE))
    const [name, setName] = useState<string | null | undefined>(cookies.get(USER_COOKIE))
    const roomRef = useRef<HTMLInputElement>(null);

    const [roomList, setRoomList] = useState<DocumentData[] | undefined>([]);
    const [usersList, setUsersList] = useState<DocumentData[] | undefined>([]);

    useEffect(() => {
        getRooms().then((result: DocumentData[] | undefined) => setRoomList(result))

        allUsers().then((result : DocumentData[] | undefined) => setUsersList(result))
    }, [isAuth, room])

    const handleNewRoom = async () => {
        console.log(roomRef.current?.value)
        if (!roomRef.current?.value) return;
        newRoom(roomRef.current.value)
        setRoom(roomRef.current.value)
    }
    if(!isAuth){
        return(
            <Auth setAuth={setIsAuth} username={setName} />
        )
    }
    return (
        <div className="home-100-container">
            <div className='home-center-content-container'>
                <Auth setAuth={setIsAuth} username={setName} />
                <div className="home-room-list-new-room-container">
                    <div className="room-list-container">
                        {!room && <p className="room-category-title">rooms available</p>}
                        <div className="room-list-padding">
                        {!room && roomList?.map((r: DocumentData) => <RoomItem key={uuid()} PsetRoom={setRoom} Pdocument={r}/>)}
                        </div>
                    </div>
                    <div className="new-room-container">
                        <div className="new-room-padding">
                            {!room && (
                                <div>
                                    <ThemeProvider theme={FontTheme}>
                                        <Input inputRef={roomRef} placeholder='chat name' sx={{color: 'darkgreen'}}/>
                                        <GeneralButton onClick={handleNewRoom}>Enter Chat</GeneralButton>
                                    </ThemeProvider>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="users-container">
                    {!room && 
                        usersList?.map((u: DocumentData) => {
                            console.log(u)
                            return(
                                <p>{u.user}</p>
                            )
                        })
                    }
                </div>
                {room && <Chat room={room} roomsetting={setRoom}/>}
            </div>
        </div>
    )
}

export default Home;
