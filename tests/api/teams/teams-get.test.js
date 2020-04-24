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
* Tests that a valid team can be obtained through the teamsController without throwing any errors.
*/

describe('team get details', () => {
    it('should empty array', async () => {
        const res = await request(app)
        .get('/api/teams');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(0);
    });

    it('should return teams details', async () => {
        await request(app)
        .post('/api/teams/save')
        .send(teamComplete);
        await request(app)
        .post('/api/teams/save')
        .send(teamComplete1);
        const res = await request(app)
        .get('/api/teams');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
    });

    it('should return team details based on id', async () => {
        const postRes = await request(app)
        .post('/api/teams/save')
        .send(teamComplete);
        const {_id} = postRes.body;
        console.log(_id);
        const res = await request(app)
        .get('/api/teams/'+ _id);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', teamComplete.name);
    });
});



const teamComplete = {
    name: 'JusticeLeage',
    meanAlignment: 'GOOD',
    heroes: [
    ]
};

const teamComplete1 = {
    name: 'SucideSquad',
    meanAlignment: 'BAD',
    heroes: [
    ]
};