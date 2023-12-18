import Auth from './Components/Auth';
import { useState, useRef, useEffect } from 'react';
import Chat from './Components/Chat';
import { cookies } from './Components/fire';
import { newRoom, g_Rooms, g_Acceptor } from './Functions/roomFunctions';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import { AUTH_COOKIE, ROOM_COOKIE, USER_COOKIE } from './Exports/types';
import "./css/Home.css";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, ThemeProvider } from '@mui/material';
import RoomItem from './Components/RoomItem';
import { v4 as uuid } from 'uuid';
import { FontTheme } from './Material/MaterialThemes';
import { GeneralButton } from './Material/MaterialCustoms';
import { acceptInvite, g_allUsers, g_Inviter, inList, inviteUser } from './Functions/userFunctions';
function Home() {

    const [isAuth, setIsAuth] = useState<string>(cookies.get(AUTH_COOKIE));
    const [room, setRoom] = useState<string | null>(cookies.get(ROOM_COOKIE))
    const [name, setName] = useState<string | null | undefined>(cookies.get(USER_COOKIE))
    const roomRef = useRef<HTMLInputElement>(null);

    const [roomList, setRoomList] = useState<DocumentData[] | undefined>([]);
    const [usersList, setUsersList] = useState<DocumentData[] | undefined>([]);

    const [inviteRoom, setInviteRoom] = useState<string>("");

    const [currentInviteList, setCurrentInviteList] = useState<string[]>([]);

    const [invitedto, setInvitedto] = useState<DocumentData[]>([]);

    /**
     * fetch rooms created and in
     * get list of rooms invited to
     * get list of users
     */
    useEffect(() => {
        g_Rooms().then((result: DocumentData[] | undefined) => setRoomList(result))

        g_Acceptor().then((result: DocumentData[]) => {
            setInvitedto(result);
        }).catch((error: Error) => console.log(error))

        g_allUsers().then((result: DocumentData[] | undefined) => setUsersList(result))
    }, [isAuth, room, inviteRoom])

    /**
     * only handle invite list to room
     */
    useEffect(() => {
        g_Inviter(inviteRoom)
            .then((result) => setCurrentInviteList(result))
    }, [inviteRoom])

    const handleNewRoom = async () => {
        if (!roomRef.current?.value) return;
        if (!name) return;
        newRoom(roomRef.current.value, name)
        setRoom(roomRef.current.value)
    }

    const handleInviteRoomState = (event: SelectChangeEvent) => {
        setInviteRoom(event.target.value)

        if (event.target.value === "") {
            setCurrentInviteList([])
            return
        }
    }

    const handleInvite = (user: string) => {
        if (inviteRoom === "") return;
        inviteUser(inviteRoom, user);
        g_Inviter(inviteRoom)
            .then((result) => setCurrentInviteList(result))
    }

    const handleAcceptInvite = (key: string, s: DocumentReference) => {
        acceptInvite(key, s).then(() => window.location.reload())
    }

    if (!isAuth) {
        return (
            <Auth setAuth={setIsAuth} username={setName} />
        )
    }
    return (
        <div className="home-100-container">
            <div className='home-center-content-container'>
                <div className='header-room-sign-out-container'>
                    <p className='header-room-paragraph'>{(room) ? room : ""}</p>
                    <Auth setAuth={setIsAuth} username={setName} />
                </div>
                <div className="home-room-list-new-room-container">
                    {!room &&
                        <>
                            <div className="room-list-container">
                                <p className="room-category-title">rooms available</p>
                                {/**
                                 * "invited to" rooms and rooms currently in
                                 */}
                                <div className="room-list-padding">
                                    {invitedto.map((s: DocumentData) => {
                                        return (
                                            <ThemeProvider key={uuid()} theme={FontTheme}>
                                                <div key={uuid()} style={{ display: "flex" }}>
                                                    <p>{s.data().room}</p>
                                                    <GeneralButton onClick={() => handleAcceptInvite(s.data().room, s.id)}>accept</GeneralButton>
                                                </div>
                                            </ThemeProvider>
                                        );
                                    })}
                                    {roomList?.map((r: DocumentData) => {
                                        return (
                                            <RoomItem key={uuid()} PsetRoom={setRoom} Pdocument={r.data()} />
                                        );
                                    })}
                                </div>
                            </div><div className="new-room-container">
                                {/**
                                 *  input for a new chat room
                                 */}
                                <div className="new-room-padding">
                                    {!room && (
                                        <div className="new-room-input-field-button">
                                            <ThemeProvider theme={FontTheme}>
                                                <TextField
                                                    /**TARGET BORDER COLORS */
                                                    sx={{
                                                        '.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                                        },

                                                        '.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: "darkgreen",
                                                        }
                                                    }}
                                                    placeholder='new chatroom name'
                                                    inputRef={roomRef} />
                                            </ThemeProvider>
                                            <GeneralButton onClick={handleNewRoom} style={{ margin: "10px 0 0 0" }}>start chatting :)</GeneralButton>

                                        </div>
                                    )}
                                </div>
                            </div>
                        </>}
                </div>
                {!room &&
                    <div className="users-dropdown-container">
                        {/**
                            * listing rooms created to invite other members
                            */}
                        <ThemeProvider theme={FontTheme}>
                            <FormControl
                                variant="standard"
                                size="small"
                                sx={{
                                    m: 1,
                                    minWidth: 100,
                                    '.MuiInputLabel-root.Mui-focused': {
                                        color: 'darkgreen'
                                    },
                                    '.MuiInputBase-root.Mui-focused': {
                                        borderBottom: '2px solid darkgreen'
                                    },
                                    '.MuiInputBase-root.Mui-focused:after': {
                                        borderBottom: '2px solid darkgreen'
                                    }
                                }}>
                                <InputLabel>Room</InputLabel>
                                <Select
                                    value={inviteRoom}
                                    onChange={handleInviteRoomState}
                                    autoWidth
                                    label="room"
                                >
                                    <MenuItem value="">
                                        <em>none</em>
                                    </MenuItem>
                                    {
                                        roomList?.map((r: DocumentData) => {
                                            return (
                                                <MenuItem key={uuid()} value={r.data().title}>{r.data().title}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </ThemeProvider>
                        {/**
                         * listing all users
                         * if user is already invited to room or in room, 
                         */}
                        <div className="users-container">
                            {usersList?.map((u: DocumentData) => {
                                console.log(!inList(currentInviteList, u.data().user) && u.data().user != cookies.get(USER_COOKIE));
                                if (!inList(currentInviteList, u.data().user) && u.data().user != cookies.get(USER_COOKIE))
                                    return (
                                        <ThemeProvider key={uuid()} theme={FontTheme}>
                                            <GeneralButton onClick={() => { handleInvite(u.data().user) }}>{u.data().user}</GeneralButton>
                                        </ThemeProvider>
                                    )
                                return (
                                    <ThemeProvider key={uuid()} theme={FontTheme}>
                                        <GeneralButton disabled>{u.data().user}</GeneralButton>
                                    </ThemeProvider>
                                )
                            })}
                        </div>
                    </div>
                }
                {room && <Chat room={room} roomsetting={setRoom} />}
            </div>
        </div>
    )
}

export default Home;
