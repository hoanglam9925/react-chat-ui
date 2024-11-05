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
    margin-right: 10px;
    margin-top: ${({ firstMessage }) => firstMessage ? "16px" : "2px"};
    position: relative;
    box-sizing: border-box;
    margin-bottom: ${({ lastMessage }) => lastMessage ? "16px" : "2px"};
    z-index: 1;
`



export const Container = styled.div`
max-width:40vw;
min-width:80px;
margin-left: 10px;
justify-content:flex-end;
align-items:flex-end;
gap:10px;
position:relative;
box-sizing: border-box;
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


const DebugInfo = styled.div`
    font-size: 10px;
    margin-left: 10px;
    color: rgba(0,0,0,.36);
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
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
    debugInfo
}: Omit<Props, "showHeader" | "showAvatar" | "type">) {

    const { themeColor } = useContext(MinChatUIContext)

    const textColor = useColorSet("--outgoing-message-text-color")
    const backgroundColor = useColorSet("--outgoing-message-background-color")
    const timestampColor = useColorSet("--outgoing-message-timestamp-color")
    const checkmarkColor = useColorSet("--outgoing-message-checkmark-color")
    const loaderColor = useColorSet("--outgoing-message-loader-color")
    const linkColor = useColorSet("--outgoing-message-link-color")


    function stringify(obj_from_json: any) {
        if (typeof obj_from_json !== "object" || obj_from_json === null) {
            return obj_from_json;
        }
        const formattedString = Object.entries(obj_from_json)
        .map(([key, value]) => `${key}: ${value}`)
        .join('<br>');

        return formattedString;
    }



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
                        >{text}</TextContent>}

                    <Timestamp
                        showSeen
                        color={timestampColor}
                        loaderColor={loaderColor}
                        checkmarkColor={checkmarkColor}
                        date={created_at}
                        seen={seen}
                        failed={failed}
                        loading={loading} />

                </Container>
                {debugInfo && <DebugInfo dangerouslySetInnerHTML={{ __html: stringify(debugInfo) }}></DebugInfo>}
            </div>
        </Wrapper>
    )
}

