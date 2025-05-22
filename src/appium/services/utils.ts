
export const  formatMessage = (message: string, totalLength: number = 100) => {
    const padding = totalLength - message.length - 2; // 2 spaces around the message
    if (padding <= 0) return message;

    const halfPad = Math.floor(padding / 2);
    const prefix = '-'.repeat(halfPad);
    const suffix = '-'.repeat(padding - halfPad);

    return `${prefix} ${message} ${suffix}`;
}