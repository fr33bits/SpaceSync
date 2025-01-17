import { db } from '../app.ts'
import express from 'express'
import { getErrorMessage, reservationStaticValidator } from '../../src/functions/common.ts'

const reservations = (req: express.Request, res: express.Response) => {
    db.query('SELECT * FROM reservations', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch reservations' });
        } else {
            res.json(results);
        }
    });
};

const reservation = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    db.query('SELECT * FROM reservations WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch reservation' });
        } else {
            res.json(results);
        }
    });
};

const newReservation = async (req: express.Request, res: express.Response) => {
    const { title, start, end } = req.body;

    const staticValidationResult = reservationStaticValidator(title, start, end)
    if (staticValidationResult) {
        res.status(400).json({
            errorCode: staticValidationResult,
            message: getErrorMessage(staticValidationResult, true, 'en')
        })
    } else if (await isOccupied(undefined, start, end, undefined) != false) {
        res.status(409).json({ // 409 HTTP error code
            errorCode: 'time_period-occupied',
            message: getErrorMessage('time_period-occupied', true, 'en')
        })
    } else {
        db.query(
            'INSERT INTO reservations (title, start, end, created_at, last_modified_at) VALUES (?, ?, ?, UNIX_TIMESTAMP(), NULL)',
            [title, start, end],
            (err, result: any) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Failed to add reservation' });
                } else {
                    res.status(201).json({ message: 'Reservation added', id: result.insertId });
                }
            }
        );
    }
};

const updateReservation = async (req: express.Request, res: express.Response) => {
    const { title, start, end, id } = req.body;

    const staticValidationResult = reservationStaticValidator(title, start, end)
    if (staticValidationResult) {
        res.status(400).json({
            errorCode: staticValidationResult,
            message: getErrorMessage(staticValidationResult, true, 'en')
        })
    } else if (await isOccupied(undefined, start, end, id) != false) {
        res.status(409).json({ // 409 HTTP error code
            errorCode: 'time_period-occupied',
            message: getErrorMessage('time_period-occupied', true, 'en')
        })
    } else {
        db.query(
            'UPDATE reservations SET title = ?, start = ?, end = ?, last_modified_at = UNIX_TIMESTAMP() WHERE id = ?',
            [title, start, end, id],
            (err, result: any) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Failed to update reservation' });
                } else {
                    res.status(201).json({ message: 'Reservation updated' });
                }
            }
        );
    };
}

const deleteReservation = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    db.query('DELETE FROM reservations WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete reservation' });
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

const isOccupied = async (room_id: number | void, start: number, end: number, id: number | undefined): Promise<boolean | string> => {
    let query: string
    let queryArgs: any[]
    if (id) {
        query = 'SELECT * FROM reservations WHERE id <> ? AND NOT (end <= ? OR start >= ?)'
        queryArgs =  [id, start, end]
    } else {
        query = 'SELECT * FROM reservations WHERE NOT (end <= ? OR start >= ?)'
        queryArgs =  [start, end]
    }
    return new Promise((resolve, reject) => {
        db.query(
            query,
            queryArgs,
            (err, result) => {
                if (err) {
                    console.error(err);
                    reject("The SQL query in the function isOccupied returned an error");
                } else {
                    resolve((result as any[]).length > 0); // true if there are overlapping reservations, false otherwise
                }
            }
        );
    });
};