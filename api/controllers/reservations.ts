import { db } from '../app.ts'
import express from 'express'
import { getNoticeDetails } from '../../common/notices.ts'
import { reservationStaticValidator } from '../../common/validation.ts'
import mysql2 from 'mysql2';

const reservations = (req: express.Request, res: express.Response) => {
    db.query('SELECT * FROM reservations',
        (err: mysql2.QueryError | null, result: mysql2.ResultSetHeader) => {
            if (err) {
                console.error(err);
                res.status(500).json({
                    noticeCode: 'reservations-fetch-failed',
                    message: getNoticeDetails('reservations-fetch-failed', true, 'en')
                });
            } else {
                res.json(result);
            }
        });
};

const reservation = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    db.query('SELECT * FROM reservations WHERE id = ?', [id], (err: mysql2.QueryError | null, result: mysql2.ResultSetHeader) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                noticeCode: 'reservation-fetch-failed',
                message: getNoticeDetails('reservation-fetch-failed', true, 'en')
            });
        } else {
            res.json(result);
        }
    });
};

const newReservation = async (req: express.Request, res: express.Response) => {
    const { title, start, end } = req.body;

    const staticValidationResult = reservationStaticValidator(title, start, end, false, false)
    if (staticValidationResult) {
        res.status(400).json({
            noticeCode: staticValidationResult,
            message: getNoticeDetails(staticValidationResult, true, 'en')
        })
    } else if (await isOccupied(undefined, start, end, undefined) != false) {
        res.status(409).json({ // 409 HTTP error code
            noticeCode: 'time_period-occupied',
            message: getNoticeDetails('time_period-occupied', true, 'en')
        })
    } else {
        db.query(
            'INSERT INTO reservations (title, start, end, created_at, last_modified_at) VALUES (?, ?, ?, UNIX_TIMESTAMP(), NULL)',
            [title, start, end],
            (err: mysql2.QueryError | null, result: mysql2.ResultSetHeader) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({
                        noticeCode: 'reservation-add-failed',
                        message: getNoticeDetails('reservation-add-failed', true, 'en')
                    });
                } else {
                    res.status(201).json({ message: 'Reservation added', id: result.insertId });
                }
            }
        );
    }
};

const updateReservation = async (req: express.Request, res: express.Response) => {
    const { title, start, end, id } = req.body;

    const staticValidationResult = reservationStaticValidator(title, start, end, false, false)
    if (staticValidationResult) {
        res.status(400).json({
            noticeCode: staticValidationResult,
            message: getNoticeDetails(staticValidationResult, true, 'en')
        })
    } else if (await isOccupied(undefined, start, end, id) != false) {
        res.status(409).json({ // 409 HTTP error code
            noticeCode: 'time_period-occupied',
            message: getNoticeDetails('time_period-occupied', true, 'en')
        })
    } else {
        db.query(
            'UPDATE reservations SET title = ?, start = ?, end = ?, last_modified_at = UNIX_TIMESTAMP() WHERE id = ?',
            [title, start, end, id],
            (err: mysql2.QueryError | null, result: mysql2.ResultSetHeader) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({
                        noticeCode: 'reservation-update-failed',
                        message: getNoticeDetails('reservation-update-failed', true, 'en')
                    });
                } else {
                    res.status(201).json({ message: 'Reservation updated' });
                }
            }
        );
    };
}

const deleteReservation = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    db.query('DELETE FROM reservations WHERE id = ?', [id], (err: mysql2.QueryError | null, result: mysql2.ResultSetHeader) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                noticeCode: 'reservation-delete-failed',
                message: getNoticeDetails('reservation-delete-failed', true, 'en')
            });
        } else {
            res.json({ message: 'Reservation deleted' });
        }
    });
};

export default {
    reservations,
    reservation,
    newReservation,
    updateReservation,
    deleteReservation
}

const isOccupied = async (
    room_id: number | void,
    start: number,
    end: number,
    id: number | undefined
): Promise<boolean | string> => {
    let query: string
    let queryArgs: [number, number, number] | [number, number];
    if (id) {
        query = 'SELECT * FROM reservations WHERE id <> ? AND NOT (end <= ? OR start >= ?)'
        queryArgs = [id, start, end]
    } else {
        query = 'SELECT * FROM reservations WHERE NOT (end <= ? OR start >= ?)'
        queryArgs = [start, end]
    }
    return new Promise((resolve, reject) => {
        db.query(
            query,
            queryArgs,
            (err: mysql2.QueryError | null, result: mysql2.ResultSetHeader[]) => {
                if (err) {
                    console.error(err);
                    reject("The SQL query in the function isOccupied returned an error"); // ! this message technically isn't processed further
                } else {
                    resolve(result.length > 0); // true if there are overlapping reservations, false otherwise
                }
            }
        );
    });
};