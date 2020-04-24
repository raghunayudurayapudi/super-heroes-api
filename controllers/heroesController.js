const { Heroes } = require("../models/Heroes");
const { Teams } = require("../models/Teams");
const asyncMiddleware = require("../middlewares/async");

/**
 *        {
      id: '616fbae4-7d94-11ea-bc55-0242ac131234',
      name: 'Arrow',
      alignment: 'GOOD',
      teams: [
        '616fbae4-7d94-11ea-bc55-0242ac131201'
      ]
    },
 */

// - Demonstrate use of REST conventions, Include routes to:
// - add a superhero
// - add a team
// - add a superhero to the team (superheros may be members of more than one team)
//   - remove a group
//   - remove a superhero from a team
//   - remove a superhero
//   - retrieve a superhero by Id (including the teams they are part of)
//   - retrieve a team by Id (including the superheros on the team)

module.exports = {
  createOrUpdateHeroes: asyncMiddleware(async (req, res, next) => {
    const errors = {};
    const { _id } = req.body || undefined;
    const { name, alignment, teams } = req.body;
    const heroFields = {};
    if (name) heroFields.name = name;
    if (alignment) heroFields.alignment = alignment;
    heroFields.teams = teams || [];

    const hero = await Heroes.findById(_id);
    if (hero) {
      const updateHero = await Heroes.findByIdAndUpdate(
        { _id },
        { $set: heroFields },
        { new: true }
      );
      heroFields.teams = [...updateHero.teams, teams];
      return res.status(200).json(updateHero);
    }
    const updateHero = await new Heroes(heroFields).save();
    res.status(200).json(updateHero);
  }),
  getHeroes: asyncMiddleware(async (req, res) => {
    const errors = {};
    const heroes = await Heroes.find();
    if (!heroes) {
      errors.notFound = "Heroes not found";
      return res.status(404).json(errors);
    }
    res.status(200).json(heroes);
  }),
  getHerosById: asyncMiddleware(async (req, res) => {
    const errors = {};
    const _id = req.value.params;
    const hero = await Heroes.findById({
      _id,
    });
    if (!hero) {
      errors.notFound = "hero not found";
      return res.status(404).json(errors);
    }
    res.status(200).json(hero);
  }),
  deleteHero: asyncMiddleware(async (req, res) => {
    const errors = {};
    const _id = req.value.params;
    const hero = await Heroes.findByIdAndRemove(_id);
    if (!hero) {
      errors.notFound = "Hero not found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ success: true });
  }),
};
