import React, { useEffect, useState } from 'react'
import Loading from './loading'
import styled from 'styled-components'
// import { calculateTimeAgo } from '../../../utils/date-utils'
import Failed from '../../failed'

type Props = {
    messageLink?: string
    loading?: boolean
    date?: Date
    seen?: boolean
    failed?: boolean
    showSeen?: boolean
    color?: string
    loaderColor?: string
    checkmarkColor?: string
    debugInfo?: object
    type?: "incoming" | "outgoing"
}


const LoadingContainer = styled.div<{
    color?: string
}>`
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    margin-right:4px;
    margin-left:2px;


    ${({ color }) => color ? `color: ${color};` : ''}
`

export const Content = styled.div<{
    color?: string
}>`
text-align:right;
vertical-align:text-top;
font-size:10px;

margin-right:2px;
align-self:flex-start;
line-height:auto;
color: ${({ color }) => color || 'rgb(75 85 99)'};
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
`

const Check = styled.div<{
    color?: string
}>`
position:relative;
width:16px;
height:16px;
padding-bottom:4px;
padding-right:4px;
color: ${({ color }) => color || 'rgb(75 85 99)'};
`

const PlaceholderCheck = styled(Check)`
width:8px;
`

const Container = styled.div<{
    type?: "incoming" | "outgoing"
}>`
display:flex;
width: 100%; 
position: relative;
justify-content: space-between;
align-items: center;
background-color: #D0D0D0;
padding: 0 5px 0 10px;
border-bottom-left-radius: 8px;
border-bottom-right-radius: 8px;
border: ${({ type }) => type === "outgoing" ? "1px solid #fff" : "none"};
border-top: none;
// margin-top: -8px;

`

const DebugInfo = styled.div`
    align-self: flex-start;
    display: block;
    padding: 5px 5px 5px 0;
    font-size: 10px;
    margin-left: 7px;
    color: #333333;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
 `

export default function Timestamp({
    loading,
    date,
    showSeen,
    seen,
    failed,
    color,
    loaderColor,
    checkmarkColor,
    // messageLink,
    debugInfo,
    type
}: Props) {

    const [dateSent, setDateSent] = useState<string | undefined>()

    useEffect(() => {
        function updateDateSent() {
            if (date) {
                // setDateSent(calculateTimeAgo(date))
                // Show raw date in a specific format
                setDateSent(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`);
            }
        }

        updateDateSent()

        const intervalId = setInterval(() => updateDateSent(), 60_000)

        return () => clearInterval(intervalId);

    }, [])

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
        <Container type={type} className='row' style={{margin: "0px"}}>
            {/* {messageLink ? <div style={{ fontSize: "10px", color: "red", marginRight: "10px", marginLeft: "6px", display: 'none' }}>
                <a href={messageLink} target="_blank" rel="noopener noreferrer">See details</a>
            </div> : <div></div>} */}
            
            {debugInfo && <DebugInfo dangerouslySetInnerHTML={{ __html: stringify(debugInfo) }}></DebugInfo>}

            <div style={{ position: "absolute", right: "14px", top: "6px" }}>
                <Content color={color}>{dateSent}</Content>

                {loading ?
                    <LoadingContainer  > <Loading color={loaderColor} /> </LoadingContainer>
                    : (failed ? <Failed></Failed> :
                        (showSeen ?
                            <Check
                                color={checkmarkColor}>
                                {seen ?


                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        width="16px"
                                        height="16px"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"><path
                                            fillRule="evenodd"
                                            d="m6 16.293 9.646-9.647.708.708-10 10a.5.5 0 0 1-.708 0l-4-4 .708-.708L6 16.293zm6 0 9.646-9.647.707.708-9.999 10a.5.5 0 0 1-.707 0l-1.5-1.5.707-.708L12 16.293z"
                                            clipRule="evenodd"></path></svg>
                                    :

                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        width="16px"
                                        height="16px"
                                        viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"></path>
                                        <path
                                            fill='currentColor'
                                            d="M9 16.17L5.53 12.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L9 16.17z"></path></svg>


                                }
                            </Check>
                            :
                            <PlaceholderCheck />
                        ))
                }
            </div>
        </Container>
    )
}