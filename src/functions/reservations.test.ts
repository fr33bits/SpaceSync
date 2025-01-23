/**
 * @jest-environment jsdom // Required for window.confirm to work as jsdom simulates the browser environment
 */

import axios from 'axios';
import { Reservation } from '../../common/types'
import { getReservations, getReservation, createReservation, updateReservation, deleteReservation } from './reservations';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// the mock Axios responses (that axios delivers in reservations.ts) are not the same as the actual responses from the API as some data like the status, config, headers, etc. are missing but those are not relevant as to the actual output that the reservations.ts functions return
describe('API Client Tests - Reservations', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks between tests
    });

    describe('getReservations', () => {
        test('should return an array of reservations on success', async () => {
            const mockData: Reservation[] = [
                {
                    id: 1, title: 'Meeting 1', start: 1737100800, end: 1737103500, created_at: 1737100700, last_modified_at: undefined
                },
                {
                    id: 2, title: 'Meeting 2', start: 1737103501, end: 1737103900, created_at: 1737103700, last_modified_at: 1737103750
                },
            ];
            mockedAxios.get.mockResolvedValueOnce({ data: mockData });

            const result = await getReservations();
            expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:4000/api/reservations");
            expect(result).toEqual(mockData);
        });
    });

    describe('getReservation', () => {
        test('should return a single reservation on success', async () => {
            const mockData: Reservation[] = [
                {
                    id: 1, title: 'Meeting 1', start: 1737100800, end: 1737103500, created_at: 1737100700, last_modified_at: undefined
                }
            ];
            mockedAxios.get.mockResolvedValueOnce({ data: mockData });

            const result = await getReservation(1);
            expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:4000/api/reservations/1");
            expect(result).toEqual(mockData[0]);
        });
    });

    describe('createReservation', () => {
        test('should return the created reservation on success', async () => {
            const mockReservation: Reservation = {
                title: 'Meeting',
                start: 1737100800,
                end: 1737103500,
            };
            const mockResponse: Reservation = {
                ...mockReservation,
                id: 1,
                created_at: 1737100700, // since this is a test environemnt, this could really be any value
                last_modified_at: undefined
            };
            mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

            const result = await createReservation(mockReservation);
            expect(mockedAxios.post).toHaveBeenCalledWith(
                "http://localhost:4000/api/reservations",
                mockReservation
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('updateReservation', () => {
        test('should send a PUT request to update a reservation', async () => {
            const mockReservation: Reservation = {
                id: 1,
                title: 'Updated Meeting',
                start: 1737100800,
                end: 1737103500,
            };
            mockedAxios.put.mockResolvedValueOnce({ message: 'Reservation updated' });

            await updateReservation(mockReservation);
            expect(mockedAxios.put).toHaveBeenCalledWith(
                "http://localhost:4000/api/reservations",
                mockReservation
            );
        });
    });

    describe('deleteReservation', () => {
        test('should send a DELETE request and return true on confirmation', async () => {
            jest.spyOn(globalThis, 'confirm').mockReturnValueOnce(true); // Mock confirm dialog; globalThis must be used as window.confirm is not available in Node.js
            mockedAxios.delete.mockResolvedValueOnce({"message": "Reservation deleted"});

            const result = await deleteReservation(1);
            expect(mockedAxios.delete).toHaveBeenCalledWith(
                "http://localhost:4000/api/reservations/1"
            );
            expect(result).toBe(true);
        });
    });
});