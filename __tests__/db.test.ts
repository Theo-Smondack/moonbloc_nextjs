import DbConnection from "../utils/dbConnection";

describe('MongoDB tests', () => {
    const instance = DbConnection.getInstance();
    it('should return an instance of DbConnection', async () => {
        expect(await instance).toBeInstanceOf(DbConnection);
    });
    it('should return a connection', async () => {
        expect(await (await (instance)).getConnection()).toBeDefined();
    });
    it('should close the connection', async () => {
        expect(await (await (instance)).closeConnection()).toBeUndefined();
    });

});