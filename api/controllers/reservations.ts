import { db } from '../app.js'
import { Request, Response } from 'express'

const reservations = (req: Request, res: Response) => {
    db.query('SELECT * FROM reservations', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch reservations' });
        } else {
            res.json(results);
        }
    });
};

const reservation = (req: Request, res: Response) => {
    const { id } = req.body;
    db.query('SELECT * FROM reservations WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch reservation' });
        } else {
            res.json(results);
        }
    });
};

const newReservation = (req: Request, res: Response) => {
    const { name, date, time } = req.body;
    db.query(
        'INSERT INTO reservations (name, date, time) VALUES (?, ?, ?)',
        [name, date, time],
        (err, result: any) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to add reservation' });
            } else {
                res.status(201).json({ message: 'Reservation added', id: (result as any).insertId });
            }
        }
    );
};

const updateReservation = (req: Request, res: Response) => {
    const { name, date, time, id } = req.body;
    db.query(
        'UPDATE reservations SET (name, date, time) VALUES (?, ?, ?, ) WHERE id = ?',
        [name, date, time, id],
        (err, result: any) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to update reservation' });
            } else {
                res.status(201).json({ message: 'Reservation updated', id: result.insertId });
            }
        }
    );
};

const deleteReservation = (req: Request, res: Response) => {
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
