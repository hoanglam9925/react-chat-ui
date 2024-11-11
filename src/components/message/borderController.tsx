

type Props = {
    type: "incoming" | "outgoing",
    last?: boolean,
    single?: boolean,
    set_fixed_height?: boolean,

}
export const getBorderCss = ({
    type,
    last,
    single,
    set_fixed_height
}: Props) => {

    let borderTopLeft, borderTopRight, borderBottomLeft, borderBottomRight

    if (type === "outgoing") {
        borderTopLeft = true
        borderBottomLeft = true
        borderBottomRight = last ? true : false
        borderTopRight = !last && single ? true : false
    } else {
        borderTopRight = true
        borderBottomRight = true
        borderBottomLeft = single || last ? true : false
        borderTopLeft = last ? true : false
    }

    return `
    border-top-left-radius: ${borderTopLeft ? "8px" : "2px"};
    border-top-right-radius: ${borderTopRight ? "8px" : "2px"};
    border-bottom-left-radius: ${borderBottomLeft ? "8px" : "2px"};
    border-bottom-right-radius: ${borderBottomRight ? "8px" : "2px"};
    height: ${set_fixed_height ? "500px" : null};    
    `

}