// @ts-nocheck
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Loading from '../loading';
import ConversationType from '../../types/ConversationType';
import Conversation from '../conversation';
import useColorSet from '../../hooks/useColorSet';
import MinChatUIContext from '../../contexts/MinChatUIContext';
import useDetectScrollPosition from '../../hooks/useDetectScrollPosition';

export interface Props {
  onConversationClick?: (index: number) => void;
  conversations?: ConversationType[];
  loading?: boolean;
  selectedConversationId?: string;
  onScrollToBottom?: () => void;
  onScrollToTop?: () => void;
  themeColor?: string;
  mobileView?: boolean;
  /**
   * the current user on the chat ui
   */
  currentUserId?: string;
  renderCustomConversationitem?: (conversation: ConversationType, index: number) => React.ReactNode
  customLoaderComponent?: React.ReactNode
  customEmptyConversationsComponent?: React.ReactNode

}

const ScrollContainer = styled.div<{
  loading?: boolean,
  backgroundColor?: string
}>`
position: relative;
  height: 100%;
  width: 100%;
// padding-top: ${({ loading }) => loading ? '0px' : '56px'};
border-radius: 16px;
box-sizing: border-box;
overflow-y: auto;
max-height: 100vh;
overflow-x: hidden;
background-color: ${({ backgroundColor }) => backgroundColor || '#ffffff'};
scrollbar-width: none; /* Firefox */
 -ms-overflow-style: none;  /* Internet Explorer 10+ */
::-webkit-scrollbar { /* WebKit */
    width: 0;
    height: 0;
  }
`;

const Container = styled.div`
  height: 100%;
  position: relative;
  max-height: 100vh;
  overflow: hidden;
`;

// const SearchElement = styled.input`
// width:100%;
// height:40px;
// padding:0px;
// position:relative;
// background-color:#e5e7eb;
// border-radius:20px;
// border:1px solid #ecebeb;
// font-size:14px;
// font-family:SF Pro Text;
// line-height:auto;
// padding-left: 16px;
// text-align:left;
// vertical-align:text-top;
// margin-right: 56px;
// &:focus{
//     outline: none;

// }
//  `

const NoChatsTextContainer = styled.div<{
  color?: string
}>`
  color: ${({ color }) => color || 'rgba(0, 0, 0, 0.36)'};
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;


const LoadingContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
position: relative;
`

export default function ConversationList({
  conversations,
  loading,
  onConversationClick,
  selectedConversationId,
  onScrollToBottom,
  onScrollToTop,
  currentUserId,
  renderCustomConversationitem,
  customLoaderComponent,
  customEmptyConversationsComponent
}: Props) {
  const scrollContainerRef = useRef<any>();

  const backgroundColor = useColorSet("--chatlist-background-color")
  const noConversation = useColorSet("--no-conversation-text-color")
  const { themeColor } = useContext(MinChatUIContext)

  // const { detectBottom, detectTop } = useDetectScrollPosition(scrollContainerRef)
  const [isScrollingTop, setIsScrollingTop] = useState(false);
  const isScrollingTopRef = useRef(isScrollingTop);

  const previousScrollTop = useRef<any>()
  const previousScrollHeight = useRef<any>()

  const isFirstRender = useRef(true);
  const observeRef = useRef<any>();

  useEffect(() => {
    isScrollingTopRef.current = isScrollingTop;
  }, [isScrollingTop])

  const adjustScrollPosition = () => {
    const scrollContainer = scrollContainerRef.current;

    const newScrollHeight = scrollContainer.scrollHeight;

    if (isFirstRender.current) {
      // Scroll to the bottom on first render
      // scrollContainer.scrollTop = newScrollHeight;
      scrollContainer.scrollTop = 0;
      isFirstRender.current = false;
    } else {
      if (isScrollingTopRef.current) {
        // Maintain relative scroll position
        scrollContainer.scrollTop = newScrollHeight - previousScrollHeight.current;
      }
      // Maintain relative scroll position
      // scrollContainer.scrollTop = newScrollHeight - previousScrollHeight.current;
      // scrollContainer.scrollTop + (newScrollHeight - previousScrollHeight.current);
    }

    // Update refs timeout
    setTimeout(() => {
      previousScrollTop.current = scrollContainer.scrollTop;
      previousScrollHeight.current = scrollContainer.scrollHeight;
    }, 50);

  };

  useEffect(() => {
    scrollContainerRef.current.scrollTop = 10;
    setTimeout(() => {
        scrollContainerRef.current.scrollTop = 0;
    }, 100);
    const observeRef = new MutationObserver(adjustScrollPosition);
    observeRef.observe(scrollContainerRef.current, { childList: true, subtree: true });

    return () => {
      observeRef.disconnect(); // Cleanup observer on unmount
    };
  }, []);


  useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    if (previousScrollHeight.current == null) {
      previousScrollHeight.current = scrollContainer.scrollHeight;
    }
    if (previousScrollTop.current == null) {
      previousScrollTop.current = scrollContainer.scrollTop
    }
  }, [])


  return (
    <Container>
      <ScrollContainer
        backgroundColor={backgroundColor}
        loading={loading}
        onScroll={() => {
          //detect when scrolled to bottom
          // Some error not allowing to scroll to bottom so added 15px
          const bottom = scrollContainerRef.current.scrollHeight - scrollContainerRef.current.scrollTop < scrollContainerRef.current.clientHeight + 15;
          if (bottom) {
            onScrollToBottom && onScrollToBottom();
          }
          const top = scrollContainerRef.current.scrollTop === 0;
          if (top) {
            setIsScrollingTop(true);
            onScrollToTop && onScrollToTop();
            setTimeout(() => {
              setIsScrollingTop(false);
            }, 1000);
          }
        }}
        ref={scrollContainerRef}
      >
        {loading ?
          <LoadingContainer>
            {customLoaderComponent ?
              customLoaderComponent :
              <Loading themeColor={themeColor} />}
          </LoadingContainer> : (
            <>
              {conversations && conversations.length <= 0 && (
                customEmptyConversationsComponent ?
                  customEmptyConversationsComponent :
                  <NoChatsTextContainer color={noConversation}>
                    <p>No conversation started...</p>
                  </NoChatsTextContainer>
              )}

              {conversations &&
                conversations.map((conversation, index) => (
                  (renderCustomConversationitem && renderCustomConversationitem(conversation, index)) ?
                    renderCustomConversationitem(conversation, index)
                    :
                    <Conversation
                      onClick={() => onConversationClick && onConversationClick(index)}
                      key={index}
                      sentiment_color={conversation?.sentiment_color}
                      title={conversation.title}
                      blockMessage={conversation?.blocked_message}
                      lastMessage={conversation.lastMessage}
                      avatar={conversation.avatar}
                      selected={selectedConversationId === conversation.id}
                      currentUserId={currentUserId}
                      unread={conversation.unread}
                    />
                ))}
            </>
          )}
      </ScrollContainer>
    </Container>
  );
}
