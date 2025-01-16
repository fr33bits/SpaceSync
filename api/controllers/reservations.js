import { db } from '../app.js'

const reservations = (req, res) => {
    db.query('SELECT * FROM reservations', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch reservations' });
        } else {
            res.json(results);
        }
    });
};

const reservation = (req, res) => {
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

const newReservation = (req, res) => {
    const { name, date, time } = req.body;
    db.query(
        'INSERT INTO reservations (name, date, time) VALUES (?, ?, ?)',
        [name, date, time],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to add reservation' });
            } else {
                res.status(201).json({ message: 'Reservation added', id: result.insertId });
            }
        }
    );
};

const updateReservation = (req, res) => {
    const { name, date, time, id } = req.body;
    db.query(
        'UPDATE reservations SET (name, date, time) VALUES (?, ?, ?, ) WHERE id = ?',
        [name, date, time], id,
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to update reservation' });
            } else {
                res.status(201).json({ message: 'Reservation updated', id: result.insertId });
            }
        }
    );
};

const deleteReservation = (req, res) => {
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
