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
* Tests that a valid hero can be created through the heroesController without throwing any errors.
*/

describe('hero create', () => {
    it('can be created correctly', async () => {
        const res = await request(app)
        .post('/api/heroes/save')
        .send(heroComplete);
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe(heroComplete.name);
    });

    it('requires name and alignment', async () => {
        const res = await request(app)
        .post('/api/heroes/save')
        .send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual("\"name\" is required");
    });
});



const heroComplete = {
    name: 'Arrow',
    alignment: 'GOOD',
    teams: []
};