import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import shareIcon from './share.svg'
import { calculateTimeAgo } from '../../../utils/date-utils'


type Props = {
    children?: string
    color?: string
    linkColor?: string
    date?: Date
    messageLink?: string
}

export const Content = styled.div<{
    color?: string
    linkColor?: string
}>`
text-align:left;
vertical-align:text-top;
font-size:14px;
align-self:flex-start;
line-height:auto;
color:${({ color }) => color || '#000000'};
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
padding-left:16px;
padding-right:16px;
padding-top:8px;
padding-bottom:8px;
position: relative;
box-sizing: border-box;
word-wrap: break-word;
max-width: 90%;

a {
    color: ${({ linkColor }) => linkColor || 'blue'};
}
`

const ShareButton = styled.a`
    width: 50px;
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    text-decoration: none;

    &:hover {
        text-decoration: none;
    }

    &::before {
        content: "";
        position: absolute;
        left: 0px;
        top: 50%;
        transform: translateY(-50%);
        height: 80%;
        color: #ccc;
        font-size: 20px;
        line-height: 36px;
        font-weight: 300;
        padding-top: 10px;
        padding-bottom: 10px;
        border-left: 1px solid #ccc;
    }
`

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

export default function TextContent({
    linkColor,
    color,
    children = "",
    date,
    messageLink
}: Props) {

    const [dateSent, setDateSent] = useState<string | undefined>()

    useEffect(() => {
        function updateDateSent() {
            if (date) {
                setDateSent(calculateTimeAgo(date))
            }
        }

        updateDateSent()

        const intervalId = setInterval(() => updateDateSent(), 60_000)

        return () => clearInterval(intervalId);
    }, [])

    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return (
        <Container>
            <Content
                linkColor={linkColor}
                color={color}
                dangerouslySetInnerHTML={{ __html: children.replace(urlRegex, '<a href="$&" target="_blank">$&</a>') }} />
            <ShareButton className="share-button" href={messageLink ? messageLink : ""} target="_blank">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <img src={shareIcon} alt="share" />
                    <div style={{ fontSize: "10px", color: "#333333", paddingTop: "5px" }}>{dateSent}</div>
                </div>
            </ShareButton>
        </Container>
    )
}