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
* Tests that a valid Team can be created through the teamsController without throwing any errors.
*/

describe('team create', () => {
    it('can be created correctly', async () => {
        const res = await request(app)
        .post('/api/teams/save')
        .send(teamComplete);
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe(teamComplete.name);
    });

    it('requires name and meanAlignment', async () => {
        const res = await request(app)
        .post('/api/teams/save')
        .send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual("\"name\" is required");
    });

    it('should add the hero to the team', async () => {
        const heroRes = await request(app)
        .post('/api/heroes/save')
        .send(heroComplete);
        const teamRes = await request(app)
        .post('/api/teams/save')
        .send(teamComplete);
        const heroId = heroRes.body._id;
        const teamId = teamRes.body._id;
        const res = await request(app)
        .put('/api/teams/saveHero')
        .send({
            _id: teamId,
            heroes: [heroId]
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe(teamComplete.name);
        expect(res.body.meanAlignment).toBe('GOOD');
    });
});



const teamComplete = {
    name: 'JusticeLeage',
    meanAlignment: 'NEUTRAL',
    heroes: [
    ]
};

const heroComplete = {
    name: 'Arrow',
    alignment: 'GOOD',
    teams: []
};