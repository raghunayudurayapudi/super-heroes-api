const dbHandler = require("../../db-handler");
const express = require("express");
const app = express();
const request = require('supertest')
require("../../../startUp/parser")(app);
require("../../../startUp/routes")(app);

beforeAll(async () => {
    await dbHandler.connect();
});

afterEach(async ()=> {
    await dbHandler.clearDatabase();
});

afterAll(async () => {
    await dbHandler.closeDatabase();
})

/**
* Tests that a valid hero can be deleted without throwing any errors.
*/

describe('hero delete', () => {
    it('should return error when hero is not found', async () => {
        const res = await request(app)
        .delete('/api/heroes/5ea2549d5f9d972eca237430');
        expect(res.statusCode).toEqual(404);
        expect(res.body.notFound).toBe('Hero not found');
    });

    it('should delete hero with valid id', async () => {
        const postRes = await request(app)
        .post('/api/heroes/save')
        .send(heroComplete);
        const {_id} = postRes.body;
        console.log(_id);
        const res = await request(app)
        .delete('/api/heroes/'+ _id);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('success', true);
    });
});



const heroComplete = {
    name: 'Arrow',
    alignment: 'GOOD',
    teams: []
};