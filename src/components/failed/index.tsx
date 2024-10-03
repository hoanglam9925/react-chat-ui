import React from 'react';
import styled from 'styled-components';
import useColorSet from '../../hooks/useColorSet';

type Props = {
  message?: string;
  themeColor?: string;
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
`;

const IconWrapper = styled.div<{ themeColor?: string }>`
  font-size: 8px;
  color: ${({ themeColor }) => themeColor || '#ff4d4f'}; /* Default to red */
  margin-bottom: -2px;
  margin-right: 8px;
`;

const Message = styled.div<{ themeColor?: string }>`
  font-size: 8px;
  color: ${({ themeColor }) => themeColor || '#ff4d4f'};
  text-align: center;
`;

export default function Failed({ message = '', themeColor }: Props) {
  const color = useColorSet("--error-color");

  return (
    <Container>
      <IconWrapper themeColor={color || themeColor}>
        ❌ {/* A simple "cross" emoji as an error icon */}
      </IconWrapper>
      <Message themeColor={color || themeColor}>
        {message}
      </Message>
    </Container>
  );
}
