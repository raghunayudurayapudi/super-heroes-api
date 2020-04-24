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
* Tests that a valid team can be deleted without throwing any errors.
*/

describe('team delete', () => {
    it('should return error when team is not found', async () => {
        const res = await request(app)
        .delete('/api/teams/5ea2549d5f9d972eca237430');
        expect(res.statusCode).toEqual(404);
        expect(res.body.notFound).toBe('Team not found');
    });

    it('should delete team with valid id', async () => {
        const postRes = await request(app)
        .post('/api/teams/save')
        .send(teamComplete);
        const {_id} = postRes.body;
        console.log(_id);
        const res = await request(app)
        .delete('/api/teams/'+ _id);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('success', true);
    });

    it('should delete hero from valid team', async () => {
        const heroRes = await request(app)
        .post('/api/heroes/save')
        .send(heroComplete);
        const teamRes = await request(app)
        .post('/api/teams/save')
        .send(teamComplete);
        const heroId = heroRes.body._id;
        const teamId = teamRes.body._id;
        const putRes = await request(app)
        .put('/api/teams/saveHero')
        .send({
            _id: teamId,
            heroes: [heroId]
        });
        const res = await request(app)
        .delete(`/api/teams/${teamId}/${heroId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('success', true);
    })
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