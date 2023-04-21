
export const getTimeDifference = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000) + 1;
    if (seconds < 2) {return `Now`; }
    if (seconds < 60) { return `${seconds}s`; }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) { return `${minutes}m`; }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) { return `${hours}h`; }
    const days = Math.floor(hours / 24); if (days < 7) { return `${days}d`; }
    if (days < 365) { const weeks = Math.floor(days / 7); return `${weeks}w`; }
    const years = Math.floor(days / 365); return `${years}y`; 
};