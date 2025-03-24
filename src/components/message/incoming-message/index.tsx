// @ts-ignore
import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { Container as MyMessageContainer, Wrapper as MyMessageWrapper, Background } from '../outgoing-message'
import placeholderProfilePNG from './profile.webp'
import MediaContent from '../media-content'
import { getBorderCss } from '../borderController'
import TextContent from '../text-content'
import { Props } from '..'
import Timestamp from '../timestamp'
import useColorSet from '../../../hooks/useColorSet'
import MinChatUIContext from '../../../contexts/MinChatUIContext'


const MessageContainer = styled(MyMessageContainer)`
    margin-left: 0px;
    box-sizing: border-box;
    margin-bottom: 0px;
`


const Wrapper = styled(MyMessageWrapper)`
justify-content: start;
align-items: flex-end;
`

const DPContainer = styled.div`
    width: 32px;
    height: 32px;
    margin-left: 10px;
    box-sizing: border-box;

`
const DisplayPicture = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 9999px;
    box-sizing: border-box;
    border-width: 2px;
    border-color: rgb(255 255 255);
    object-fit: cover;
    position: relative;
    z-index: 1;
`



const Name = styled.div<{
    color?: string
}>`
text-align:left;
vertical-align:text-top;
font-size:14px;
align-self:flex-start;
line-height:auto;
color:${({ color }) => color || "#4b5563"};
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
font-weight: 500;

`

const TextWrapper = styled.div`
margin-left:8px;
box-sizing: border-box;
`


const IncomingMessageBackground = styled(Background) <{
    backgroundColor?: string
}>`
    ${({ backgroundColor }) => !backgroundColor ? "opacity: 0.5;" : ""}
`

const HeaderContainer = styled.div`
 display: flex; 
 align-items: "center";
 margin-top: 16px;
 margin-bottom: 6px;
 `

const DebugInfo = styled.div`
    font-size: 10px;
    color: rgba(0,0,0,.36);
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
 `



export default function IncomingMessage({
    text,
    media,
    user,
    showAvatar,
    showHeader,
    last,
    single,
    created_at,
    debugInfo
}: Omit<Props, "type" | "clusterFirstMessage" | "clusterLastMessage" | "seen">) {

    const { themeColor } = useContext(MinChatUIContext)

    const [avatar, setAvatar] = React.useState<string>(placeholderProfilePNG)

    useEffect(() => {
        if (user?.avatar && user.avatar.trim().length > 0) {
            setAvatar(user.avatar)
        }
    }, [user])


    const textColor = useColorSet("--incoming-message-text-color")
    const nameTextColor = useColorSet("--incoming-message-name-text-color")
    const linkColor = useColorSet("--incoming-message-link-color")

    const backgroundColor = useColorSet("--incoming-message-background-color")
    const timestampColor = useColorSet("--incoming-message-timestamp-color")

    const customBackgroundColor = media?.type == 'audio' ? 'transparent' : backgroundColor

    function extractStyledContent(htmlString: string) {
        // Guard clause for non-string inputs
        if (typeof htmlString !== 'string') return null;

        const styleRegex = /<([a-z]+)[^>]*style=(['"])(.*?)\2[^>]*>(.*?)<\/\1>/i;
        const match = htmlString.match(styleRegex);

        if (match) {
            return {
                fullMatch: match[0],
                tag: match[1],
                styleContent: match[3],
                innerContent: match[4]
            };
        }
        return null;
    }

    function sanitizeStyle(styleString: string): string {
        // Only allow color styles to prevent XSS
        const colorRegex = /color:\s*([^;]+);?/;
        const colorMatch = styleString.match(colorRegex);
        return colorMatch ? `color: ${colorMatch[1]}` : '';
    }

    function stringify(obj_from_json: any): string {
        // Handle primitives and null
        if (typeof obj_from_json !== "object" || obj_from_json === null) {
            return String(obj_from_json);
        }

        // Handle arrays
        if (Array.isArray(obj_from_json)) {
            return obj_from_json.map(item => stringify(item)).join(', ');
        }

        try {
            const formattedString = Object.entries(obj_from_json)
                .map(([key, value]) => {
                    // Get key style in key
                    const keyStyle = key.includes('style=') ? extractStyledContent(key) : null;
                    let doubleQuotedStyle = '';

                    if (keyStyle?.styleContent) {
                        const sanitizedStyle = sanitizeStyle(keyStyle.styleContent);
                        if (sanitizedStyle) {
                            doubleQuotedStyle = `style="${sanitizedStyle}"`;
                        }
                    }

                    // Convert value to string, handling nested objects
                    const stringValue = typeof value === 'object' && value !== null
                        ? JSON.stringify(value)
                        : String(value);

                    return `${key}<span ${doubleQuotedStyle}>:</span> ${stringValue}`;
                })
                .join('<br>');

            return formattedString;
        } catch (error) {
            console.error('Error in stringify:', error);
            return String(obj_from_json);
        }
    }

    return (
        <Wrapper
            data-testid="incoming-message"
            className='fade-animation'
        >
            <DPContainer>
                {showAvatar &&

                    <DisplayPicture
                        onError={() => {
                            setAvatar(placeholderProfilePNG)
                        }}
                        src={avatar}
                    />}
            </DPContainer>

            <TextWrapper>
                {showHeader &&
                    <HeaderContainer>
                        <Name color={nameTextColor}>{user?.name}</Name>
                    </HeaderContainer>
                }

                <div style={{ display: "flex" }}>
                    <MessageContainer>
                        <IncomingMessageBackground
                            borderCss={(() => getBorderCss({
                                type: "incoming",
                                last,
                                single
                            }))()}
                            backgroundColor={backgroundColor}
                            bgColor={backgroundColor || customBackgroundColor || themeColor} />

                        {media ? <MediaContent
                            last={last}
                            single={single}
                            messageType='incoming'
                            {...media} />
                            :
                            <TextContent
                                linkColor={linkColor}
                                color={textColor}>{text}</TextContent>}

                        <Timestamp
                            color={timestampColor}
                            date={created_at}
                        />
                        { }
                    </MessageContainer>
                </div>
                {debugInfo && <DebugInfo dangerouslySetInnerHTML={{ __html: stringify(debugInfo) }}></DebugInfo>}
            </TextWrapper>
        </Wrapper>
    )
}

