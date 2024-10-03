import React from 'react'

export type Props = {
    children: any
    style?: React.CSSProperties
}

const defaultStyle: React.CSSProperties = {
    paddingTop: '16px',
    paddingBottom: '16px',
    width: '35%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
};

export default function Sidebar({ children, style }: Props) {
    const mergedStyle = { ...defaultStyle, ...style }
    return (
        <div style={mergedStyle}>{children}</div>
    )
}