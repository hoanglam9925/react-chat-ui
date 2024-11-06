import React, { useEffect, useRef, useState } from 'react'
import Message from '../message'
import styled from 'styled-components'
import Loading from '../loading'
import useDetectScrollPosition from '../../hooks/useDetectScrollPosition'
import MessageType from '../../types/MessageType'
import TypingIndicator from '../typing-indicator'
import MessageListBackground from '../message-list-background'
import useColorSet from '../../hooks/useColorSet'
import FlatList from 'flatlist-react'

export type MessageListProps = {
    themeColor?: string
    messages?: MessageType[]
    currentUserId?: string
    loading?: boolean
    onScrollToTop?: () => void
    mobileView?: boolean
    showTypingIndicator?: boolean
    typingIndicatorContent?: string
    customTypingIndicatorComponent?: React.ReactNode
    customEmptyMessagesComponent?: React.ReactNode
    customLoaderComponent?: React.ReactNode
}

const MessageList: React.FC<MessageListProps> = ({
    messages = [], // Default to empty array if undefined
    currentUserId,
    loading = false,
    onScrollToTop,
    themeColor = '#6ea9d7',
    mobileView,
    typingIndicatorContent,
    showTypingIndicator,
    customTypingIndicatorComponent,
    customLoaderComponent,
    customEmptyMessagesComponent,
}) => {
    const [messagesWasEmpty, setMessagesWasEmpty] = useState<boolean>(true);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const bottomBufferRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const { detectBottom, detectTop } = useDetectScrollPosition(scrollContainerRef);

    useEffect(() => {
        if (bottomBufferRef.current && scrollContainerRef.current && !messagesWasEmpty) {
            scrollToBottom();
        }
    }, [messagesWasEmpty]);

    useEffect(() => {
        if (!messages || messages.length === 0) {
            setMessagesWasEmpty(true);
        } else {
            if (messagesWasEmpty) {
                setMessagesWasEmpty(false);
                scrollToBottom();
            }
            if (detectBottom()) {
                scrollToBottom();
            }
        }
    }, [messages]);

    const noMessageTextColor = useColorSet("--no-message-text-color");

    const scrollToBottom = () => {
        if (bottomBufferRef.current && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollPoint = bottomBufferRef.current;

            const parentRect = container.getBoundingClientRect();
            const childRect = scrollPoint.getBoundingClientRect();
            const scrollOffset = childRect.top + container.scrollTop - parentRect.top;

            if (container.scrollBy) {
                container.scrollBy({ top: scrollOffset, behavior: "auto" });
            } else {
                container.scrollTop = scrollOffset;
            }
        }
    };

    return (
        <Container ref={containerRef}>
            <MessageListBackground roundedCorners={false} mobileView={mobileView} />

            <InnerContainer>
                {loading ? (
                    <LoadingContainer>
                        {customLoaderComponent ? customLoaderComponent : <Loading themeColor={themeColor} />}
                    </LoadingContainer>
                ) : (
                    <FlatList
                        list={messages.map((message, index) => ({ item: message, index }))} // Map messages to required format
                        ref={scrollContainerRef}
                        renderWhenEmpty={() => {
                            if (customEmptyMessagesComponent) return customEmptyMessagesComponent as React.ReactElement;
                            return (
                                <NoMessagesTextContainer color={noMessageTextColor}>
                                    <p>No messages yet...</p>
                                </NoMessagesTextContainer>
                            );
                        }

                        }
                        renderItem={({ item, index }: { item: MessageType; index: number }) => {
                            const { user, text, media, loading: messageLoading, failed: messageFailed, seen, createdAt, debugInfo } = item;
                            
                            let lastClusterMessage = false, firstClusterMessage = false, last = false, single = false;
                    
                            // Determine message cluster positions
                            if (index === 0) firstClusterMessage = true;
                            if (index > 0 && messages[index - 1].user.id !== user.id) firstClusterMessage = true;
                            if (index === messages.length - 1) { lastClusterMessage = true; last = true; }
                            if (index < messages.length - 1 && messages[index + 1].user.id !== user.id) { lastClusterMessage = true; last = true; }
                            if (index < messages.length - 1 && index > 0 && messages[index + 1].user.id !== user.id && messages[index - 1].user.id !== user.id) single = true;
                            if (index === 0 && index < messages.length - 1 && messages[index + 1].user.id !== user.id) single = true;
                            if (index === messages.length - 1 && index > 0 && messages[index - 1].user.id !== user.id) single = true;
                            if (messages.length === 1) single = true;
                    
                            // Render outgoing message
                            if (user.id === (currentUserId && currentUserId.toLowerCase())) {
                                return (
                                    <Message
                                        key={index}
                                        type="outgoing"
                                        last={single ? false : last}
                                        single={single}
                                        text={text}
                                        seen={seen}
                                        created_at={createdAt}
                                        media={media}
                                        loading={messageLoading}
                                        failed={messageFailed}
                                        clusterFirstMessage={firstClusterMessage}
                                        clusterLastMessage={lastClusterMessage}
                                        debugInfo={debugInfo}
                                    />
                                );
                            } else {
                                // Render incoming message
                                return (
                                    <Message
                                        type="incoming"
                                        key={index}
                                        user={user}
                                        media={media}
                                        seen={seen}
                                        created_at={createdAt}
                                        showAvatar={lastClusterMessage}
                                        showHeader={firstClusterMessage}
                                        last={single ? false : last}
                                        single={single}
                                        text={text}
                                        debugInfo={debugInfo}
                                    />
                                );
                            }
                        }}
                        onScroll={() => {
                            if (detectTop()) {
                                onScrollToTop && onScrollToTop();
                            }
                        }}
                        footer={() => (
                            <>
                                {showTypingIndicator && (
                                    customTypingIndicatorComponent ? (
                                        customTypingIndicatorComponent
                                    ) : (
                                        <TypingIndicator content={typingIndicatorContent} themeColor={themeColor} />
                                    )
                                )}
                                <Buffer ref={bottomBufferRef} />
                            </>
                        )}
                    />
                )}
            </InnerContainer>
        </Container>
    );
}

export default MessageList;

// Styled components
const Container = styled.div`
    height: 100%;
    position: relative;
    max-height: 100vh;
    overflow-y: hidden;
    padding-left: 0px;
    padding-right: 12px;
`;

const InnerContainer = styled.div`
    height: 100%;
`;

const NoMessagesTextContainer = styled.div<{ color?: string }>`
    color: ${({ color }) => color || 'rgba(0,0,0,.36)'};
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    user-select: none;
`;

const LoadingContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    position: relative;
`;

const Buffer = styled.div`
    height: 2px;
    width: 100%;
    position: relative;
`;
