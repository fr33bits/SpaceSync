import { durationFromUNIX, getCurrentDatetime, toUNIXSeconds } from "./datetime";

export const reservationStaticValidator = (title: string | undefined, startDatetime: number, endDatetime: number, newReservation: boolean | void, includeWarnings: boolean | void): string => {
    // ERRORS
    if (!title) {
        return 'title-undefined'
    }
    if (title.trim().length === 0) {
        return 'title-blank'
    }
    if (title.trim().length != title.length) {
        return 'title-leading-trailing-blank'
    }
    if (title.length > 300) {
        return 'title-exceeded-max'
    }
    // These are unnessary as TypeScript ensures that they are both defined numbers
    // if (!startDatetime) {
    //     return 'startDatetime-undefined'
    // }
    // if (!endDatetime) {
    //     return 'endDatetime-undefined'
    // }
    if (endDatetime < startDatetime) {
        return 'datetime-inverted'
    }
    if (endDatetime === startDatetime) {
        return 'datetime-same'
    }
    if (durationFromUNIX(startDatetime, endDatetime) < 300) { // min. 5 min duration
        return 'datetime-too_short'
    }
    if (durationFromUNIX(startDatetime, endDatetime) > 86400) { // max. 1 day duration
        return 'datetime-too_long'
    }

    // WARNINGS
    if (includeWarnings) {
        if (newReservation && startDatetime < toUNIXSeconds(getCurrentDatetime())) {
            return 'startDatetime-retroactive' // not necessary to add for enDatetime of course
        }
    }

    return '' // no issues found
}