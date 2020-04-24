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

describe('hero get details', () => {
    it('should empty array', async () => {
        const res = await request(app)
        .get('/api/heroes');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(0);
    });

    it('should return heroes details', async () => {
        await request(app)
        .post('/api/heroes/save')
        .send(heroComplete);
        await request(app)
        .post('/api/heroes/save')
        .send(heroComplete1);
        const res = await request(app)
        .get('/api/heroes');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
    });

    it('should return hero details', async () => {
        const postRes = await request(app)
        .post('/api/heroes/save')
        .send(heroComplete);
        const {_id} = postRes.body;
        console.log(_id);
        const res = await request(app)
        .get('/api/heroes/'+ _id);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', heroComplete.name);
    });
});



const heroComplete = {
    name: 'Arrow',
    alignment: 'GOOD',
    teams: []
};

const heroComplete1 = {
    name: 'BatMan',
    alignment: 'GOOD',
    teams: []
};