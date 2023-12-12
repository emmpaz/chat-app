import { ThemeProvider, Typography, styled } from "@mui/material";
import { DocumentData } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import { v4 as uuid } from "uuid";
import { cookies } from "./fire";
import { ROOM_COOKIE } from "../Exports/types";
import { FontTheme } from "../Material/MaterialThemes";


const RoomItemTypography = styled(Typography) ({
    color : "darkgreen",
    margin: "15px 20px 15px 20px",
}) as typeof Typography;

function RoomItem(props: {PsetRoom : Dispatch<SetStateAction<string | null>>, Pdocument : DocumentData}) {
    return(
        <div 
            key={uuid()} 
            className="room-item"
            onClick={() => { 
                props.PsetRoom(props.Pdocument.title); 
                cookies.set(ROOM_COOKIE, props.Pdocument.title) 
            }} 
        >
            <ThemeProvider theme={FontTheme}>
            <RoomItemTypography 
                fontSize={"12px"} 
                key={uuid()}
                >{props.Pdocument.title}</RoomItemTypography>
                </ThemeProvider>
        </div>
    )
}

export default RoomItem;