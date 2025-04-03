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
min-width:80px;
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


const DebugInfo = styled.div`
    font-size: 10px;
    margin-left: 20px;
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
                        showSeen={false}
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

