import React from 'react'
import User from '../../types/UserType';
import OutgoingMessage from './outgoing-message'
import IncomingMessage from './incoming-message'
import { MediaType } from '../../types/MessageType';


export type Props = {
    created_at?: Date
    seen?: boolean
    text?: string,
    media?: MediaType,
    loading?: boolean
    failed?: boolean,
    type?: "incoming" | "outgoing"
    user?: User
    showAvatar?: boolean
    showHeader?: boolean
    // determines whether its the last message in the group of outgoing or incoming
    last?: boolean
    //determines whether its the only message in the group of outgoing or incoming
    single?: boolean
    clusterFirstMessage?: boolean
    clusterLastMessage?: boolean
    debugInfo?: object
};


export default function Message({
    text,
    media,
    created_at,
    seen,
    loading,
    failed,
    type = "outgoing",
    user,
    showAvatar,
    showHeader,
    last,
    single,
    clusterFirstMessage,
    clusterLastMessage,
    debugInfo,
}: Props) {

    return (
        type === "outgoing" ?
            <OutgoingMessage
                loading={loading}
                text={text}
                created_at={created_at}
                seen={seen}
                failed={failed}
                media={media}
                last={last}
                single={single}
                clusterFirstMessage={clusterFirstMessage}
                clusterLastMessage={clusterLastMessage}
                debugInfo={debugInfo}
            />

            :

            <IncomingMessage
                showAvatar={showAvatar}
                text={text}
                created_at={created_at}
                media={media}
                user={user}
                showHeader={showHeader}
                last={last}
                single={single}
                debugInfo={debugInfo}
            />

    )
}

