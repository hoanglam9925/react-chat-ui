import React from 'react'
import styled from 'styled-components'
import Loading from './loading'

type Props = {
    children: string,
    loading?: boolean
    themeColor?: string

}

export const Wrapper = styled.div`
    display:flex;
    justify-content: end;
    margin-right: 10px;
    margin-top: 12px;
    position: relative;
    box-sizing: border-box;

`



export const Container = styled.div`
max-width:272px;
margin-bottom: 12px;
margin-left: 10px;
display:flex;
flex-direction:row;
justify-content:flex-end;
align-items:flex-end;
gap:10px;
position:relative;
box-sizing: border-box;

`
export const Background = styled.div<{ bgColor: string }>`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color:${({ bgColor }) => bgColor};
border-radius:16px;

`

export const Content = styled.div`
text-align:left;
vertical-align:text-top;
font-size:14px;
align-self:flex-start;
line-height:auto;
color:#000000;
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
padding-left:16px;
padding-right:16px;
padding-top:8px;
padding-bottom:8px;
position: relative;
box-sizing: border-box;

`

// const Check = styled.img`
// align-self:flex-start;
// top:2.5px;
// position:absolute;
// width:16px;
// height:16px;
// padding:0px;
// `

export const TimestampContainer = styled.div`
margin-right: 4px;
margin-bottom: 4px;
display:flex;
flex-direction:row;
justify-content:flex-end;
align-items:center;
box-sizing: border-box;
position:relative;
`

export const Timestamp = styled.div`
text-align:right;
vertical-align:text-top;
font-size:12px;
align-self:flex-start;
line-height:auto;
color:#7a7a7a;
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
`


const LoadingContainer = styled.div`
    position: absolute;
    height: 100%;
    display: flex;
    align-items: center;
`


export default function MyMessage({
    children,
    themeColor ='#6ea9d7',
    loading }: Props) {
    return (
        <Wrapper
            className='fade-animation'
        >
            <div>
                {/* <TimestampContainer>
                {/* <Check src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAYAAADUryzEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACMSURBVHgB7Yy9DYAgEIUVE2pHcAV7GicxbkFopIJWN3AD3cCGws4VXAMqz0QT/CMhWvKSF47LfV8UhXxO4nPMGKsJIblSajp2yAeGh0MXe38ScM7TrQ64klIOrwKtdWOMmUGSPcFCiO4qj+0PpTRDCI3bjDEuQFa64JvgIkn3vsKPAkvSw9i64JCfsgIYfzJLoAJ44wAAAABJRU5ErkJggg==' /> 
                <Timestamp>time</Timestamp>
            </TimestampContainer> */}

                <Container>
                    <Background bgColor={themeColor} />

                    <Content>{children}</Content>


                    {loading && <LoadingContainer> <Loading /> </LoadingContainer>}

                </Container>

            </div>
        </Wrapper>
    )
}
