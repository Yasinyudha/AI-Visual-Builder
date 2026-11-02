export const getBezierPath = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
) => {
    const dx = Math.max(Math.abs(x2 - x1) * 0.5, 40);
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

export const cutStringToDesiredLength = (inputString: string, desiredLength: number) => {
    if (inputString.length > desiredLength) {
        return inputString.slice(0, desiredLength) + "...";
    }

    return inputString
}