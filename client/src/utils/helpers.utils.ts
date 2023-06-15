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

export const getYear = (timestamp: string): number => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    return year;
};

export const getMonth = (timestamp: string): number => {
    const date = new Date(timestamp);
    const year = date.getMonth();
    return year;
};

export const getTimeAMPM = (timestamp: string) => {
    const time = new Date(timestamp);
    const formatedTime = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    return formatedTime
  }

export const getMonthName = (timestamp: string): string => {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    let monthName: string = '';

    if (month === 1) { monthName = 'January'; }
    if (month === 2) { monthName = 'February'; }
    if (month === 3) { monthName = 'March'; }
    if (month === 4) { monthName = 'April'; }
    if (month === 5) { monthName = 'May'; }
    if (month === 6) { monthName = 'Jun'; }
    if (month === 7) { monthName = 'July'; }
    if (month === 8) { monthName = 'August'; }
    if (month === 9) { monthName = 'September'; }
    if (month === 10) { monthName = 'Octobre'; }
    if (month === 11) { monthName = 'November'; }
    if (month === 12) { monthName = 'December'; }
    return monthName;
};