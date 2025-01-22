import { durationFromUNIX, getCurrentDatetime, toUNIXSeconds } from "../functions/datetime.ts";

export const getNoticeDetails = (notice_code: string, capitalize: boolean, language: string | void): {type: string, message: string} => {
    if (!language) {
        language = 'en'
    }

    let notice;
    switch (notice_code) {
        // DATA VALIDATION RELATED WARNINGS
        case 'startDatetime-retroactive':
            notice = {
                capitalizable: true,
                type: 'warning',
                languages: {
                    en: "the start time has already past; make sure you want to create a reservation in the past",
                    sl: "začetni čas je že mimo; prepričajte se, da hočete ustvariti rezervacijo v preteklosti"
                }
            }
            break;

        // DATA VALIDATION RELATED ERRORS
        case 'time_period-occupied':
            notice = {
                capitalizable: true,
                type: 'error',
                languages: {
                    en: "there's already a reservation for this time period",
                    sl: "za ta časovni okvir že obstaja rezervacija"
                }
            }
            break;
        case 'title-undefined':
            notice = {
                capitalizable: true,
                type: 'error',
                languages: {
                    en: "title cannot be empty",
                    sl: "naslov ne sme biti prazen"
                }
            }
            break;
        case 'title-blank':
            notice = {
                capitalizable: true,
                type: 'error',
                languages: {
                    en: "title cannot contain only blank characters (spaces)",
                    sl: "naslov ne sme vsebovati samo prazne znake (presledke)"
                }
            }
            break;
        case 'title-leading-trailing-blank':
            notice = {
                capitalizable: true,
                type: 'error',
                languages: {
                    en: "title cannot have leading or trailing blank characters (spaces)",
                    sl: "naslov ne sme vsebovati vodilnih ali končnih praznih znakov (presledkov)"
                }
            }
            break;
        case 'title-exceeded-max':
            notice = {
                capitalizable: true,
                type: 'error',
                languages: {
                    en: "title exceeds maximum allowed number of characters (300)",
                    sl: "naslov presega največje dovoljeno število znakov (300)"
                }
            }
            break;
        case 'startDatetime-undefined':
            notice = {
                capitalizable: true,
                type: 'error',
                languages: {
                    en: "start time is not defined",
                    sl: "začetni čas ni definiran"
                }
            }
            break;
        case 'endDatetime-undefined':
            notice = {
                capitalizable: true,
                type: 'error',
                languages: {
                    en: "end time is not defined",
                    sl: "kočni čas ni definiran"
                }
            }
            break;
        case 'datetime-inverted':
            notice = {
                capitalizable: true,
                type: 'error',
                languages: {
                    en: "end time must not come before the start time",
                    sl: "kočni čas ne sme biti pred začetnim časom"
                }
            }
            break;
        case 'datetime-same':
            notice = {
                capitalizable: true,
                type: 'error',
                languages: {
                    en: "start and end time must not be the same",
                    sl: "začetni in končni čas ne smeta biti ista"
                }
            }
            break;
        case 'datetime-too_short':
            notice = {
                capitalizable: true,
                type: 'error',
                languages: {
                    en: "duration is too short (min. 5 min)",
                    sl: "trajanje je prakratko (min. 5 min)"
                }
            }
            break;
        case 'datetime-too_long':
            notice = {
                capitalizable: true,
                type: 'error',
                languages: {
                    en: "duration is too long (max. 1 day)",
                    sl: "trajanje je prakratko (min. 1 day)"
                }
            }
            break;

        // SERVER RELATED ERRORS
        case 'ERR_NETWORK':
            notice = {
                capitalizable: true,
                type: 'error',
                languages: {
                    en: "network error: the server is likely unreachable",
                    sl: "omrežna napaka: strežnik je verjetno nedosegljiv"
                }
            }
            break;

        // API RESPONSE RELATED ERRORS
        case 'reservations-fetch-failed':
            notice = {
                capitalizable: true,
                type: 'error',
                languages: {
                    en: "the server failed to fetch reservations from the database; check to make sure that the MySQL Community Server is online and working (a Node.js server restart may also be required)",
                    sl: "strežniku ni uspelo pridobiti rezervacij iz podatkovne baze; preverite, da je MySQL Community Server aktiven in deluje (lahko, da je potrebno tudi ponovno zagnati Node.js strežnik)"
                }
            }
            break;
        case 'reservation-fetch-failed':
            notice = {
                capitalizable: true,
                type: 'error',
                languages: {
                    en: "the server failed to fetch reservation from the database; check to make sure that the MySQL Community Server is online and working (a Node.js server restart may also be required)",
                    sl: "strežniku ni uspelo pridobiti rezervacije iz podatkovne baze; preverite, da je MySQL Community Server aktiven in deluje (lahko, da je potrebno tudi ponovno zagnati Node.js strežnik)"
                }
            }
            break;
        case 'reservation-add-failed':
            notice = {
                capitalizable: true,
                type: 'error',
                languages: {
                    en: "failed to create reservation; check to make sure that the MySQL Community Server is online and working (a Node.js server restart may also be required)",
                    sl: "ustvarjanje rezervacije ni bilo uspešno; preverite, da je MySQL Community Server aktiven in deluje (lahko, da je potrebno tudi ponovno zagnati Node.js strežnik)"
                }
            }
            break;
        case 'reservation-update-failed':
            notice = {
                capitalizable: true,
                type: 'error',
                languages: {
                    en: "failed to update reservation; check to make sure that the MySQL Community Server is online and working (a Node.js server restart may also be required)",
                    sl: "posodabljanje rezervacije ni bilo uspešno; preverite, da je MySQL Community Server aktiven in deluje (lahko, da je potrebno tudi ponovno zagnati Node.js strežnik)"
                }
            }
            break;
        case 'reservation-delete-failed':
            notice = {
                capitalizable: true,
                type: 'error',
                languages: {
                    en: "failed to delete reservation; check to make sure that the MySQL Community Server is online and working (a Node.js server restart may also be required)",
                    sl: "brisanje rezervacije ni bilo uspešno; preverite, da je MySQL Community Server aktiven in deluje (lahko, da je potrebno tudi ponovno zagnati Node.js strežnik)"
                }
            }
            break;
        default:
            notice = {
                capitalizable: true,
                type: 'error',
                languages: {
                    en: `unknown error code: ${notice_code}`,
                    sl: `neznana koda napake ${notice_code}`
                }
            }
            break;
    }

    let messageLang = notice.languages[language]
    if (!messageLang) { // message exists in the language 'language'
        messageLang = notice.languages['en'] // default language is EN in case the message does not exist in that language
    }

    if (capitalize && notice.capitalizable && notice != undefined) {
        return {
            type: notice.type,
            message: messageLang.charAt(0).toUpperCase() + messageLang.slice(1)
        }
    } else {
        return {type: notice.type, message: messageLang }
    }
}

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
    if (!startDatetime) {
        return 'startDatetime-undefined'
    }
    if (!endDatetime) {
        return 'endDatetime-undefined'
    }
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