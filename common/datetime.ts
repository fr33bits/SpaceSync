export const getCurrentDatetime = () => {
    const now = new Date()
    return now.toISOString()
}

export const toUNIXSeconds = (time: string) : number => {
    return Math.floor(new Date(time).getTime() / 1000)
}

export const convertToLocalTime = (isoString: string) => {
    const localDate = new Date(isoString); // convert ISO string to Date object

    // padstart() needed to ensure months, days, hours and minutes occupy two digits (if necessary with a leading zero)
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`; // 'YYYY-MM-DDTHH:mm' format
}

export const getFormattedDatetimeFromUNIX = (UNIX_timestamp: number, format: string, withoutSeconds: boolean): string => {
    const date = new Date(UNIX_timestamp * 1000)
    if (format === 'date_picker-input') {
        return convertToLocalTime(date.toISOString())
    } else if (format == 'local') {
        const formattedDate = date.toLocaleDateString("sl-SI")
        const formattedTime = date.toLocaleTimeString("sl-SI")
        if (withoutSeconds) {
            return `${formattedDate} ${formattedTime}`.slice(0, -3)
        } else {
            return `${formattedDate} ${formattedTime}`
        }
    } else {
        return "Format not specified!"
    }
}

export const durationFromFormatted = (start: string, end: string) : number => { // in seconds
    return toUNIXSeconds(end) - toUNIXSeconds(start)
}

export const durationFromUNIX = (start: number, end: number) : number => {
    return end - start
}

export const durationHHMM = (duration: number): string => { // in seconds
    const hours = Math.floor(duration / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((duration % 3600) / 60).toString().padStart(2, '0');
    if (Math.floor(duration / 3600) >= 0 && Math.floor(duration / 3600) < 100 && Math.floor((duration % 3600) / 60) >= 0) {
        return `${hours}:${minutes}`;
    } else {
        return ""
    }
};