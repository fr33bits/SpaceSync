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
    const { title, start, end } = req.body;
    db.query(
        'INSERT INTO reservations (title, start, end, created_at, last_modified_at) VALUES (?, ?, ?, UNIX_TIMESTAMP(), NULL)',
        [title, start, end],
        (err, result: any) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to add reservation' });
            } else if (title === "") {
                console.error("Failed to add reservation: title cannot be empty");
                res.status(500).json({ error: "Failed to add reservation: title cannot be empty"});
            } else {
                res.status(201).json({ message: 'Reservation added', id: result.insertId });
            }
        }
    );
};

const updateReservation = (req: Request, res: Response) => {
    const { title, start, end, id } = req.body;
    db.query(
        'UPDATE reservations SET (title, start, end, modified_at) VALUES (?, ?, ?, UNIX_TIMESTAMP()) WHERE id = ?',
        [title, start, end, id],
        (err, result: any) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to update reservation' });
            } else if (title === "") {
                console.error("Failed to update reservation: title cannot be empty");
                res.status(500).json({ error: "Failed to update reservation: title cannot be empty"});
            }  else {
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
