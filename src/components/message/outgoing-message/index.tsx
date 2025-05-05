import React, { useContext } from 'react'
import styled from 'styled-components'
import MediaContent from '../media-content'
import { getBorderCss } from '../borderController'
import TextContent from '../text-content'
import Timestamp from '../timestamp'
import { Props } from '..'
import useColorSet from '../../../hooks/useColorSet'
import MinChatUIContext from '../../../contexts/MinChatUIContext'


export const Wrapper = styled.div<{ firstMessage?: boolean, lastMessage?: boolean }>`
    display:flex;
    justify-content: end;
    margin-right: 20px;
    margin-top: ${({ firstMessage }) => firstMessage ? "16px" : "2px"};
    position: relative;
    box-sizing: border-box;
    margin-bottom: ${({ lastMessage }) => lastMessage ? "16px" : "2px"};
    z-index: 1;
`



export const Container = styled.div`
max-width:70vw;
min-width:300px;
margin-left: 10px;
justify-content:flex-end;
align-items:flex-end;
gap:10px;
white-space: pre-wrap;
position:relative;
box-sizing: border-box;
margin-left: 20px;
`
export const Background = styled.div<{
    bgColor: string,
    borderCss: string,
}>`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color:${({ bgColor }) => bgColor};

    ${({ borderCss }) => borderCss};
`

export default function MyMessage({
    text,
    media,
    loading,
    failed,
    last,
    single,
    clusterFirstMessage,
    clusterLastMessage,
    created_at,
    seen,
    debugInfo,
    messageLink
}: Omit<Props, "showHeader" | "showAvatar" | "type">) {

    const { themeColor } = useContext(MinChatUIContext)

    const textColor = useColorSet("--outgoing-message-text-color")
    const backgroundColor = useColorSet("--outgoing-message-background-color")
    const timestampColor = useColorSet("--outgoing-message-timestamp-color")
    const checkmarkColor = useColorSet("--outgoing-message-checkmark-color")
    const loaderColor = useColorSet("--outgoing-message-loader-color")
    const linkColor = useColorSet("--outgoing-message-link-color")


       return (
        <Wrapper
            data-testid="outgoing-message"
            lastMessage={clusterLastMessage}
            firstMessage={clusterFirstMessage}
            className='fade-animation'
        >
            <div>


                <Container>
                    <Background
                        borderCss={(() => getBorderCss({
                            type: "outgoing",
                            last,
                            single
                        }))()}
                        bgColor={backgroundColor || themeColor} />

                    {media ? <MediaContent
                        last={last}
                        single={single}
                        messageType='outgoing'
                        {...media} />
                        :
                        <TextContent
                            linkColor={linkColor}
                            color={textColor}
                            date={created_at}
                            messageLink={messageLink}>{text}</TextContent>}

                    <Timestamp
                        showSeen={false}
                        color={timestampColor}
                        loaderColor={loaderColor}
                        checkmarkColor={checkmarkColor}
                        date={created_at}
                        seen={seen}
                        failed={failed}
                        loading={loading}
                        debugInfo={debugInfo}
                        type="outgoing"
                        messageLink={messageLink} />

                </Container>
            </div>
        </Wrapper>
    )
}

