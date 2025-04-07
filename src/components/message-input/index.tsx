// @ts-nocheck
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import useTypingListener from '../../hooks/useTypingListener';
import useColorSet from '../../hooks/useColorSet';
import MinChatUIContext from '../../contexts/MinChatUIContext';
import botSVG from './bot.svg';
import manualTakeoverSVG from './manual_takeover.svg';

export type Props = {
    onSendMessage?: (text: string) => void;
    mobileView?: boolean;
    onStartTyping?: () => void;
    onEndTyping?: () => void;
    showAttachButton?: boolean;
    onAttachClick?: () => void;
    placeholder?: string;
    disabled?: boolean;
    showSendButton: boolean;
    selectedConversation?: any;

    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
    onKeyUp?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
};

const Container = styled.div<{
    mobile?: boolean;
}>`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;

  ${({ mobile }) =>
        mobile
            ? `
    padding-right: 0px;

`
            : ` 
padding-right: 0px;
 `}
`;
const Form = styled.form<{
    backgroundColor?: string;
    borderColor?: string;
}>`
  background-color: ${({ backgroundColor }) => backgroundColor || '#f3f4f6'};
  padding-top: 8px;
  padding-bottom: 11px;
  // border-bottom-right-radius: 16px;
  // border-bottom-left-radius: 16px;
  border-radius: 16px;
  box-shadow: 0px -1px 0px rgba(0, 0, 0, 0.07999999821186066);
  position: relative;
  width: 95%;
  display: flex;
  align-items: end;
  box-sizing: border-box;
`;

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
`;

const InputBackground = styled.div<{
    showOpacity: boolean;
    bgColor?: string;
}>`
  ${({ showOpacity }) => (showOpacity ? `opacity: 0.4;` : '')}
  height: 100%;
  width: 100%;
  border-radius: 0.7rem;
  position: absolute;
  background-color: ${({ bgColor }) => bgColor};
  border: 1px solid #ecebeb;
`;

const InputElementContainer = styled.div`
  padding: 8px;
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;
`;

const InputElement = styled.div<{
    color?: string;
}>`
  width: 100%;
  border: none;
  max-height: 6.4em;
  /* Adjust this value to control the maximum number of lines */
  position: relative;
  font-size: 14px;
  overflow: scroll;

  color: ${({ color }) => color || 'rgba(0,0,0,.87)'};
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  background-color: transparent;
  text-align: left;
  opacity: 1;

  min-height: 1.6em;
  line-height: 1.6em;
  word-wrap: break-word;
  overflow-wrap: anywhere;

  &:focus {
    outline: none;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const ArrowContainer = styled.div<{ showCursor: boolean; disabled: boolean }>`
  position: relative;
  padding-left: 20px;
  padding-right: 18px;
  cursor: ${({ showCursor, disabled }) =>
        showCursor && !disabled ? 'pointer' : 'default'};
  display: flex;
  align-items: end;
  opacity: ${({ showCursor, disabled }) =>
        showCursor && !disabled ? '1' : '0.4'};
  height: 100%;
  padding-top: 8px;
  padding-bottom: 8px;
`;

const AttachmentContainer = styled.div<{ disabled: boolean }>`
  position: relative;
  padding-left: 22px;
  padding-right: 16px;
  display: flex;

  align-items: end;
  height: 100%;
  padding-top: 8px;
  padding-bottom: 10px;

  ${({ disabled }) =>
        !disabled
            ? `
    cursor: pointer;
    opacity: 1;
    `
            : `
    opacity: 0.6;
    `}
`;

const AttachPlaceholder = styled.div`
  position: relative;
  padding: 12px;
`;
const SendPlaceholder = styled.div`
  position: relative;
  padding: 12px;
`;

const PlaceHolder = styled.span<{
    color?: string;
}>`
  color: ${({ color }) => color || '#9ca3af'};
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding-left: 16px;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  font-size: 12px;
  pointer-events: none;
`;

const BotReturnContainer = styled.div`
  width: fit-content;
  border-radius: 12px;
  border: 1px solid #000;
  display: flex;
  margin: auto;
  margin-right: 10px;
  background-color: #fff;
`;

const BotImage = styled.img`
  padding: 8px 10px;
`;

const BotText = styled.span`
  font-size: 12px;
  align-content: center;
  white-space: nowrap;
  padding-right: 10px;
`;

const TakeoverContainer = styled.div`
  width: 100%;
  padding: 8px 16px;
  margin-bottom: 8px;
`;

const TakeoverRow = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const TakeoverButton = styled.div<{ variant: 'primary' | 'secondary' }>`
  flex: 1;
  height: 54px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s;
  text-align: center;

  ${({ variant }) =>
        variant === 'primary'
            ? `
    background-color: #1A86D0;
    border: 1px solid #1A86D0;
    color: #fff;
  `
            : `
    background-color: #fff;
    border: 1px solid #f00;
    color: #f00;
  `}

  &:hover {
    opacity: 0.9;
  }
`;

const TakeoverIcon = styled.img`
  width: 20px;
  height: 20px;
`;

export default function MessageInput({
    onSendMessage,
    mobileView,
    onStartTyping,
    onEndTyping,
    showAttachButton = true,
    showSendButton = true,
    disabled = false,
    onAttachClick,
    placeholder = 'Send a message...',
    onKeyDown,
    onKeyUp,
    selectedConversation,
    onBotReturnClick,
    onTakeoverClick,
    onCancelTakeoverClick,
}: Props) {
    const { themeColor } = useContext(MinChatUIContext);

    const [text, setText] = useState('');
    const inputRef = useRef<any>(null);

    const [manualUntilTimestamp, setManualUntilTimestamp] = useState(null);
    const [
        manualUntilTimestampCountdown,
        setManualUntilTimestampCountdown,
    ] = useState(null);

    const [requestAssistantTimestamp, setRequestAssistantTimestamp] = useState(
        null
    );

    const { setTyping, ...inputProps } = useTypingListener({
        onStartTyping,
        onEndTyping,
    });

    const handleSubmit = () => {
        if (!disabled && text.trim().length > 0) {
            inputRef.current.innerText = '';
            setTyping(false);
            onSendMessage && onSendMessage(text.trim());
            setText('');
        }
    };

    // colorSets
    const backgroundColor = useColorSet('--input-background-color');
    const inputTextColor = useColorSet('--input-text-color');
    const inputAttachColor = useColorSet('--input-attach-color');
    const inputSendColor = useColorSet('--input-send-color');
    const inputElementColor = useColorSet('--input-element-color');
    const inputPlaceholderColor = useColorSet('--input-placeholder-color');

    useEffect(() => {
        if (!selectedConversation) {
            setManualUntilTimestamp(null);
            setManualUntilTimestampCountdown(null);
            setRequestAssistantTimestamp(null);
            return;
        }

        setManualUntilTimestamp(null);
        setManualUntilTimestampCountdown(null);
        setRequestAssistantTimestamp(null);
        const manualUntilTimestamp = selectedConversation.manual_until_timestamp;
        const requestAssistantTimestamp = selectedConversation.request_assistant_timestamp;
        if (manualUntilTimestamp) {
            // Convert to timestamp in seconds
            const timestamp = Math.floor(
                new Date(manualUntilTimestamp).getTime() / 1000
            );
            setManualUntilTimestamp(timestamp);
        }

        if (requestAssistantTimestamp) {
            setRequestAssistantTimestamp(requestAssistantTimestamp);
        }
    }, [selectedConversation]);

    useEffect(() => {
        if (!manualUntilTimestamp) {
            setManualUntilTimestampCountdown(null);
            return;
        }

        const updateCountdown = () => {
            const now = Math.floor(Date.now() / 1000); // Current time in seconds
            const timeLeft = Math.max(0, manualUntilTimestamp - now);
            
            // Convert to HH:MM:SS
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;
            setManualUntilTimestampCountdown(`${hours}:${minutes}:${seconds}`);

            // When countdown reaches 0, trigger the bot return
            if (timeLeft === 0) {
                handleBotReturnClick();
            }
        };

        updateCountdown();

        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [manualUntilTimestamp]);

    const handleBotReturnClick = () => {
        onBotReturnClick && onBotReturnClick();
        setManualUntilTimestamp(null);
        setManualUntilTimestampCountdown(null);
    };

    const handleTakeoverClick = () => {
        onTakeoverClick && onTakeoverClick();
        setRequestAssistantTimestamp(null);
    };

    const handleCancelTakeoverClick = () => {
        onCancelTakeoverClick && onCancelTakeoverClick();
        setRequestAssistantTimestamp(null);
    };

    return (
        <Container mobile={mobileView}>
            {requestAssistantTimestamp && <TakeoverContainer>
                <TakeoverRow>
                    <TakeoverButton variant="primary" onClick={handleTakeoverClick}>
                        <TakeoverIcon src={manualTakeoverSVG} alt="takeover" />
                        <span>Take Over</span>
                    </TakeoverButton>
                    <TakeoverButton variant="secondary" onClick={handleCancelTakeoverClick}>
                        <span>Cancel Take Over Request</span>
                    </TakeoverButton>
                </TakeoverRow>
            </TakeoverContainer>}

            {manualUntilTimestampCountdown && (
                <Form
                    data-testid="message-form"
                    className="fade-animation"
                    backgroundColor={backgroundColor}
                    onSubmit={(e: any) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    {showAttachButton ? (
                        <AttachmentContainer disabled={disabled} onClick={onAttachClick}>
                            <svg
                                width="14"
                                height="18"
                                viewBox="0 0 14 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0.930542 1.99509C0.930542 0.893231 1.74213 0 2.74005 0H9.08394L13.6136 5.00246V15.9976C13.6136 17.1035 12.8009 18 11.7964 18H2.74772C1.74412 18 0.930542 17.1074 0.930542 16.0049V1.99509ZM9.98926 6.00049C8.98599 5.99995 8.17801 5.10521 8.17801 4.00019V1H2.74005C2.24162 1 1.83648 1.44645 1.83648 1.99509V16.0049C1.83648 16.5536 2.24313 17 2.74772 17H11.7964C12.3006 17 12.7077 16.5513 12.7077 15.9976V6.00196L9.98926 6.00049ZM2.74241 8.5C2.74241 8.22386 2.93704 8 3.19329 8H6.82119C7.07021 8 7.27208 8.23193 7.27208 8.5C7.27208 8.77614 7.07744 9 6.82119 9H3.19329C2.94428 9 2.74241 8.76807 2.74241 8.5ZM2.74241 11.5C2.74241 11.2239 2.94396 11 3.20413 11H10.4341C10.6891 11 10.8958 11.2319 10.8958 11.5C10.8958 11.7761 10.6943 12 10.4341 12H3.20413C2.94913 12 2.74241 11.7681 2.74241 11.5ZM2.74241 14.5C2.74241 14.2239 2.94396 14 3.20413 14H10.4341C10.6891 14 10.8958 14.2319 10.8958 14.5C10.8958 14.7761 10.6943 15 10.4341 15H3.20413C2.94913 15 2.74241 14.7681 2.74241 14.5Z"
                                    fill="#444C57"
                                />
                            </svg>
                        </AttachmentContainer>
                    ) : (
                        <AttachPlaceholder />
                    )}

                    <BotReturnContainer onClick={handleBotReturnClick}>
                        <BotImage src={botSVG} alt="bot" />
                        <BotText>Return to bot in {manualUntilTimestampCountdown}</BotText>
                    </BotReturnContainer>

                    <InputContainer>
                        <InputBackground
                            showOpacity={inputElementColor ? false : true}
                            bgColor={inputElementColor || themeColor}
                        />

                        <InputElementContainer>
                            <InputElement
                                color={inputTextColor}
                                ref={inputRef}
                                data-testid="message-input"
                                onInput={(event: any) => setText(event.target.innerText)}
                                contentEditable={!disabled}
                                suppressContentEditableWarning={true}
                                onKeyDown={(event: any) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault(); // Prevents adding a new line
                                        handleSubmit();
                                        return;
                                    }

                                    inputProps.onKeyDown();
                                    onKeyDown && onKeyDown(event);
                                }}
                                onKeyUp={(event: any) => {
                                    inputProps.onKeyUp();
                                    onKeyUp && onKeyUp(event);
                                }}
                            />
                            {text === '' && (
                                <PlaceHolder color={inputPlaceholderColor}>
                                    {placeholder}
                                </PlaceHolder>
                            )}
                        </InputElementContainer>
                    </InputContainer>

                    {showSendButton ? (
                        <ArrowContainer
                            disabled={disabled}
                            showCursor={text.trim().length > 0}
                            onClick={handleSubmit}
                        >
                            <svg
                                fill={inputSendColor || themeColor}
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 512 512"
                            >
                                <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                            </svg>
                        </ArrowContainer>
                    ) : (
                        <SendPlaceholder />
                    )}
                </Form>
            )}
        </Container>
    );
}
