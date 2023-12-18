import { v4 as uuid } from "uuid";
import '../css/ChatItem.css';


export const ChatItem = (props: { message: string, username: string, self: boolean }) => {


    return (
        <div className={(props.self) ? "indepedent-message-self" : "indepedent-message-other"} key={uuid()}>
            <p key={uuid()}>{props.username}</p>
            <p key={uuid()}>{props.message}</p>
        </div>
    )
}