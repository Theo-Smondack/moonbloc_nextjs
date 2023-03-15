import {NextApiRequest, NextApiResponse} from "next";
import getAssets from "../../pages/api/assets";

describe('Get assets API test', () => {
    describe('Given input is not valid', () => {
        it('should throw an error: "Method not allowed"', async function () {
            const req = {
                method: "POST",
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            await getAssets(req as NextApiRequest, res as unknown as NextApiResponse);
            expect(res.status).toHaveBeenCalledWith(405);
            expect(res.json).toHaveBeenCalledWith({ok: false, error: "Method not allowed"});
        });
        it('should throw an error: "Invalid credentials"', async function () {
           const req = {
                method: "GET",
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            await getAssets(req as NextApiRequest, res as unknown as NextApiResponse);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ok: false, error: "Invalid credentials"});
        });
        it('should throw an error: "Invalid credentials"', async function () {
            const req = {
                method: "GET",
                query: {
                    filter: "test"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            await getAssets(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ok: false, error: "Invalid credentials"});
        });
        it('should throw an error: "Bad Request"', async function () {
            const req = {
                method: "GET",
                query: {
                    vs_currency: "test"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            await getAssets(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ok: false, error: "Bad Request"});
        });

    });
    describe('Given input is valid', () => {
        it('should return the first 250 cryptos', async function () {
            const req = {
                method: "GET",
                query: {
                    vs_currency: "usd"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            await getAssets(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ok: true, data: expect.any(Object)});
        });
    })
})