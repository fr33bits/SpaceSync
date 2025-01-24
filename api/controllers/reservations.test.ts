import { app, db } from '../app.ts';
// import { Reservation } from '../../common/types.ts';
import supertest from 'supertest';
const request = supertest(app);

let server: ReturnType<typeof app.listen>;

beforeAll(() => {
    server = app.listen(); // start the server before running tests
});

afterAll(() => {
    server.close(); // close the server after all tests are done
    db.end()
});

// ! running these requests requries the server to be shut down to prevent port conflict
// ! requires default database set up

describe('API server tests - reservations', () => {
    test('POST /api/reservations', async () => {
        const response = await request.post('/api/reservations').send({
            title: 'Meeting',
            start: 200,
            end: 600
        })
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toEqual('Reservation added'); // an id is also returned but can't be predicted for testing purposes
        // ? maybe it could be checked if it's a number
    })
    test('PUT /api/reservations', async () => {
        const updateReservation = {
            id: 3,
            title: "Marketinški brainstorming",
            start: 1737112500,
            end: 1737114600,
        }
        const response = await request.put('/api/reservations').send(updateReservation);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: 'Reservation updated' });
    })
})