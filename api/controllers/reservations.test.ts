import { app } from '../app.ts';
// import { Reservation } from '../../common/types.ts';
import supertest from 'supertest';
const request = supertest(app);

test('GET /api/reservations', async () => {
    // running these requests requries the server to be shut down to prevent port conflict
    // requires default database set up

    const updateReservation = {
        id: 3,
        title: "Marketinški brainstorming",
        start: 1737112500,
        end: 1737114600,
    }
    const response = await request.put('/api/reservations').send(updateReservation);
    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Reservation updated' });
})