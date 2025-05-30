import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import MessageType from '../../types/MessageType';
import placeholderProfilePNG from './profile.png';
import { calculateTimeAgo } from '../../utils/date-utils';
import useColorSet from '../../hooks/useColorSet';
import MinChatUIContext from '../../contexts/MinChatUIContext';

export type Props = {
  title: string;
  sentiment_color?: string;
  statusIcon?: string;
  blockMessage?: boolean;
  lastMessage?: MessageType;
  unread?: boolean,
  avatar?: string;
  onClick: () => void;
  selected?: boolean;
  /**
   * the current user on the chat ui
   */
  currentUserId?: string;
};
const Container = styled.div<{
  selected?: boolean
}>`
  width: 100%;
  height: 88px;
  position: relative;
  // margin-top: 1px;
  cursor: pointer;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  &:hover .conversation-background {
    opacity: ${props => props.selected ? 1 : 0.09};
    background-color: #444C57;
  }

  & .conversation-user-title {
    color: ${props => props.selected ? '#fff' : ''};
  }

  & .conversation-user-extend-info {
    color: ${props => props.selected ? '#fff' : '#9b9c9d'};
  }
`;
const ContentContainer = styled.div<{
  sentiment_color?: string;
}>`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  padding-left: 8px;
  // padding-right: 8px; /* Include right padding for symmetry */
  // padding-top: 10px; /* Adjust top padding as needed */
  // padding-bottom: 10px; /* Adjust bottom padding as needed */
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  &::before {
    content: "";
    position: absolute; 
    top: 10px;
    bottom: 10px;
    width: 7px;
    margin: -10px;
    z-index: 999;
    pointer-events: none; 
    background-color: ${props => props?.sentiment_color ?? 'transparent'};
  }
`;

const Background = styled.div<{
  themeColor: string
  selected?: boolean
  hoverColor?: string
  backgroundColor?: string
  selectedBackgroundColor?: string
}>`
position: absolute;
width: 100%;
height: 100%;
background-color: ${({ themeColor, selected, backgroundColor, selectedBackgroundColor }) =>
    selected ? (selectedBackgroundColor || themeColor) : (backgroundColor || '#ffffff')};
// opacity: 0.2;
z-index: 0;
// transition: all 0.3s ease-in-out;

&:hover{
${({ selected }) => (!selected ? 'opacity: 0.09;' : '')} 
background-color: ${({ themeColor, hoverColor }) => hoverColor || themeColor};
color: red;
z-index: 1;

}
`;

const Name = styled.div<{
  unread?: boolean,
  titleTextColor?: string
}>`
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  text-align: left;
  vertical-align: text-top;
  font-size: 14px;
  line-height: auto;
  position: relative;
  z-index: 1;
  color: ${({ titleTextColor }) => titleTextColor || '#000000'};

  ${({ unread }) =>
    unread
      ? `
font-weight: 700;
`
      : ''}
`;

const NameContainer = styled.div`
display: flex;
width: 100%;
justify-content: space-between;
`

const Timestamp = styled.div<{
  color?: string,
  selected?: boolean,
  unread?: boolean
}>`
text-align:right;
vertical-align:text-top;
font-size:12px;
margin-left: 6px;
margin-top:2px;
margin-right:2px;
align-self:flex-start;
line-height:auto;
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
 
${({ unread, color, selected }) =>
    selected
      ? `
        color: #fff;
        font-weight: ${unread ? '600' : 'normal'};
      `
      : unread
        ? `
          color: ${color || 'black'};
          font-weight: 600;
        `
        : `
          color: ${color || 'rgb(75 85 99)'};
        `
  }
`

// const LastMessageUser = styled.div<{ seen?: boolean }>`
// font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
//     text-align:left;
// vertical-align:text-top;
// font-size:12px;
// align-self:flex-start;
// position:relative;
// color:#7a7a7a;
// white-space: nowrap;
// text-overflow: ellipsis;

// ${({ seen }) => !seen ? `
// color: black;
// font-weight: 600;
// ` : ''}

// `

const MessageComponent = styled.div<{
  unread?: boolean;
  width: number;
  selected?: boolean;
  media?: boolean;
  color?: string
}>`
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  text-align: left;
  vertical-align: text-top;
  font-size: 12px;
  align-self: flex-start;
  position: relative;
  // color: ${({ color }) => color || '#7a7a7a'};

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  box-sizing: border-box;
  max-width: ${({ width }) => width}px;
  display: flex;
  margin-top: 4px;

  ${({ unread, selected, color }) =>
    selected
      ? `
        color: #fff;
        font-weight: ${unread ? '600' : 'normal'};
      `
      : unread
        ? `
          color: ${color || 'black'};
          font-weight: 600;
        `
        : `
          color: ${color || '#7a7a7a'};
        `
  }
`;


const TextContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  padding-right: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
`;

const DisplayPictureContainer = styled.div`
  width: 44px;
  height: 44px;
  margin-right: 12px;
  box-sizing: border-box;
  position: relative;
`;

const DisplayPictureStatus = styled.img<{
  sentiment_color?: string
}>`
  // width: 20px;
  height: 20px;
  box-sizing: border-box;
  border-width: 2px;
  border-color: rgb(255 255 255);
  object-fit: cover;
  z-index: 2;
  position: absolute;
  top: -8px;
  left: -4px;
  // -webkit-filter: drop-shadow(0px 0px 2px rgb(255,255,255));
  // filter: drop-shadow(0px 0px 2px rgb(255,255,255));
`

const DisplayPicture = styled.img<{
  selected?: boolean
}>`
  width: 44px;
  height: 44px;
  // border-radius: 9999px;
  box-sizing: border-box;
  border-width: 2px;
  border-color: rgb(255 255 255);
  object-fit: cover;
  filter: ${({ selected }) => (selected ? 'drop-shadow(0px 3px 6px black);' : 'none')};
  z-index: 1;
  position: relative;
`;

const MediaIconContainer = styled.div`
  width: 16px;
  height: 16px;
  margin-left: 3px;
`;

const MediaContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  gap: 4px;
  margin-left: 4px;
`

export default function Conversation({
  title,
  sentiment_color,
  statusIcon,
  blockMessage,
  lastMessage,
  onClick,
  avatar,
  selected = false,
  currentUserId,
  unread
}: Props) {
  const [containerWidth, setContainerWidth] = useState(0);

  const [usedAvatar, setUsedAvatar] = React.useState<string>(
    placeholderProfilePNG
  );

  const [usedStatusIcon, setUsedStatusIcon] = React.useState<string | null>(
    statusIcon ?? null
  );

  const [dateSent, setDateSent] = useState<string | undefined>()
  const [intervalId, setIntervalId] = useState<any>()

  const { themeColor } = useContext(MinChatUIContext)

  useEffect(() => {
    function updateDateSent() {
      if (lastMessage?.createdAt) {
        setDateSent(calculateTimeAgo(new Date(lastMessage.createdAt)))
      }
    }

    updateDateSent()
    clearInterval(intervalId)

    const id = setInterval(() => updateDateSent(), 60_000)
    setIntervalId(id)

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null); // Reset intervalId after clearing
      }

    };
  }, [lastMessage])


  useEffect(() => {
    window.addEventListener('resize', () => {
      calculateContainerWidth();
    });
  }, []);

  useEffect(() => {
    if (avatar && avatar.trim().length > 0) {
      setUsedAvatar(avatar);
    }
  }, [avatar]);

  useEffect(() => {
    setUsedStatusIcon(null);
    if (statusIcon && statusIcon.trim().length > 0) {
      setUsedStatusIcon(statusIcon);
    }
  }, [statusIcon]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    calculateContainerWidth();
  }, [containerRef]);


  const backgroundColor = useColorSet("--chatitem-background-color")
  const titleTextColor = useColorSet("--chatitem-title-text-color")
  const contentTextColor = useColorSet("--chatitem-content-text-color")
  const hoverColor = useColorSet("--chatitem-hover-color")
  const selectedBackgroundColor = useColorSet("--chatitem-selected-background-color")


  /**
   *
   */
  const calculateContainerWidth = () => {
    if (containerRef && containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  };


  const getMediaIcon = () => {

    switch (lastMessage?.media?.type) {
      case "image":
        return <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          width={"100%"}
          height={"100%"}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>

      case "video":
        return <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          width={"100%"}
          height={"100%"}
        >
          <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      case "gif":
        return <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          width={"100%"}
          height={"100%"}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 8.25v7.5m6-7.5h-3V12m0 0v3.75m0-3.75H18M9.75 9.348c-1.03-1.464-2.698-1.464-3.728 0-1.03 1.465-1.03 3.84 0 5.304 1.03 1.464 2.699 1.464 3.728 0V12h-1.5M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>


      default:
        return <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          width={"100%"}
          height={"100%"}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
        </svg>

    }
  }

  const getMediaText = () => {

    switch (lastMessage?.media?.type) {
      case "image":
        return "Image"
      case "video":
        return lastMessage?.media?.name ? lastMessage?.media?.name : "Video"
      case "gif":
        return lastMessage?.media?.name ? lastMessage?.media?.name : "Gif"
      default:
        return lastMessage?.media?.name ? lastMessage?.media?.name : "File"
    }
  }

  return (
    <Container ref={containerRef} onClick={onClick} className="fade-animation" selected={selected}>
      <Background className='conversation-background'
        selected={selected}
        hoverColor={hoverColor}
        selectedBackgroundColor={selectedBackgroundColor}
        backgroundColor={backgroundColor}
        themeColor={themeColor} />

      <ContentContainer sentiment_color={sentiment_color}>
        <div style={{ marginLeft: '10px' }}>
          <DisplayPictureContainer>
            <DisplayPicture
              selected={selected}
              onError={() => {
                setUsedAvatar(placeholderProfilePNG);
              }}
              src={usedAvatar}
            />
            {usedStatusIcon && <DisplayPictureStatus src={usedStatusIcon} />}
          </DisplayPictureContainer>
        </div>

        <TextContainer>

          <NameContainer>
            <Name
              titleTextColor={titleTextColor}
              unread={unread}><div dangerouslySetInnerHTML={{ __html: title }}></div></Name>

            <Timestamp
              unread={unread}
              selected={selected}
              color={contentTextColor}>{dateSent}</Timestamp>
          </NameContainer>

          <MessageComponent
            selected={selected}
            color={contentTextColor}
            width={containerWidth - 96}
            unread={unread}
          >
            {lastMessage?.user.id === currentUserId
              ? 'You'
              : lastMessage?.user.name}
            :{'  '}
            {lastMessage?.media ? (
              <MediaContainer>
                <MediaIconContainer>
                  {getMediaIcon()}
                </MediaIconContainer>
                {getMediaText()}
              </MediaContainer>
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: lastMessage?.text?.slice(0, 50) || "" }}></div>
            )}
          </MessageComponent>
          {blockMessage && <div dangerouslySetInnerHTML={{ __html: blockMessage }}></div>}
        </TextContainer>
      </ContentContainer>
    </Container>
  );
}
