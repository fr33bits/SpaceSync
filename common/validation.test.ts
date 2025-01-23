import { reservationStaticValidator } from "./validation";
import { getCurrentDatetime, toUNIXSeconds } from "./datetime";

describe("Title-related tests", () => {
    test("Title is empty", () => {
        expect(reservationStaticValidator("", 0, 0, true, false)).toEqual("title-undefined");
    });
    test("Title is a blank space", () => {
        expect(reservationStaticValidator(" ", 0, 0, true, false)).toEqual("title-blank");
    });
    test("Title has a trailing blank space", () => {
        expect(reservationStaticValidator("title ", 0, 0, true, false)).toEqual("title-leading-trailing-blank");
    });
    test("Title has a leading blank space", () => {
        expect(reservationStaticValidator(" title", 0, 0, true, false)).toEqual("title-leading-trailing-blank");
    });
    test("Title is too long", () => {
        expect(reservationStaticValidator("a".repeat(301), 0, 0, true, false)).toEqual("title-exceeded-max");
    });
})

describe("Timing-related tests", () => {
    test("The end time is before the start time", () => {
        expect(reservationStaticValidator("std_title", 5, 0, true, false)).toEqual("datetime-inverted");
    });
    test("The start time is the same as the end time", () => {
        expect(reservationStaticValidator("std_title", 0, 0, true, false)).toEqual("datetime-same");
    });
    test("The duration of the reservation is too short", () => {
        expect(reservationStaticValidator("std_title", 0, 299, true, false)).toEqual("datetime-too_short");
        expect(reservationStaticValidator("std_title", 0, 1, true, false)).toEqual("datetime-too_short");
        expect(reservationStaticValidator("std_title", 200, 300, true, false)).toEqual("datetime-too_short");
    });
    test("The duration of the reservation is sufficiently long", () => {
        expect(reservationStaticValidator("std_title", 0, 300, true, false)).toEqual("");
        expect(reservationStaticValidator("std_title", 0, 500, true, false)).toEqual("");
        expect(reservationStaticValidator("std_title", 0, 86399, true, false)).toEqual("");
        expect(reservationStaticValidator("std_title", 0, 86400, true, false)).toEqual("");
    });
    test("The duration of the reservation is too long", () => {
        expect(reservationStaticValidator("std_title", 0, 86401, true, false)).toEqual("datetime-too_long");
        expect(reservationStaticValidator("std_title", 200, 86601, true, false)).toEqual("datetime-too_long");
    });
    test("The start time for a new reservation is already in the past", () => {
        expect(reservationStaticValidator("std_title", toUNIXSeconds(getCurrentDatetime()) - 100, toUNIXSeconds(getCurrentDatetime()) + 500, true, true)).toEqual("startDatetime-retroactive"); // merely -1 is not enough
        expect(reservationStaticValidator("std_title", toUNIXSeconds(getCurrentDatetime()) - 100, toUNIXSeconds(getCurrentDatetime()) + 200, true, true)).toEqual("startDatetime-retroactive");
    });
})