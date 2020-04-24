const mongoose = require("mongoose");
const { heroesSchema } = require("./Heroes");
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

/**
 *           {
      id: '616fbae4-7d94-11ea-bc55-0242ac131201',
      name: 'JusticeLeage',
      meanAlignment: 'GOOD',
      heroes: [
        '616fbae4-7d94-11ea-bc55-0242ac130003',
        '616fbae4-7d94-11ea-bc55-0242ac130012',
        '616fbae4-7d94-11ea-bc55-0242ac131234',
      ],
    },
 */
const teamsSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 80,
    required: true
  },
  meanAlignment: {
      type: String,
      minlength: 2,
      maxlength: 80,
      required: true
  },
  heroes: {
    type: Array,
    of: heroesSchema,
    required: true
  }
});

const validateteams= {
  teams: Joi.object().keys({
    _id: Joi.objectId(),
    name: Joi.string()
      .min(2)
      .max(80)
      .required(),
    meanAlignment: Joi.string()
    .min(2)
    .max(80)
    .required(),
    heroes: Joi.array().items(
      Joi.object().keys({
        _id: Joi.objectId(),
        name: Joi.string()
          .min(2)
          .max(80)
          .required()
      }))
  }),
  addHero: Joi.object().keys({
    _id: Joi.objectId(),
    heroes: Joi.array().items(Joi.objectId())
  }) 
}
const Teams = new mongoose.model("teams", teamsSchema);

exports.Teams = Teams;
exports.teamsSchema = teamsSchema;
exports.validateteams = validateteams;
