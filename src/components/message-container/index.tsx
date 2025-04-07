import React from 'react'
import styled from 'styled-components'

export type Props = {
    children: React.ReactNode
    showConversationList?: boolean
}

const Container = styled.div<{
    showConversationList?: boolean
}>`
    position: relative;
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    border: ${props => !props.showConversationList ? "1px solid #aaa;" : "none"};
    overflow: hidden;
`


export default function MessageContainer({
    children,
    showConversationList,
}: Props) {
  return (
    <Container showConversationList={showConversationList}>
        {children}
    </Container>
    )
}