import React from 'react'

export type Props = {
    children: any
    style?: React.CSSProperties
}

const defaultStyle: React.CSSProperties = {
    // paddingTop: '16px',
    paddingBottom: '16px',
    width: '38vw',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    backgroundColor: '#fff',
    // transition: 'all 0.3s ease',
    overflow: 'hidden',
};

export default function Sidebar({ children, style }: Props) {
    const mergedStyle = { ...defaultStyle, ...style }
    return (
        <div style={mergedStyle}>{children}</div>
    )
}