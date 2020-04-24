const mongoose = require("mongoose");
const { teamsSchema } = require("./Teams");
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
// Joi.objectId = require('joi-objectid')(Joi);
/**
 *        {
      id: '616fbae4-7d94-11ea-bc55-0242ac131234',
      name: 'Arrow',
      alignment: 'GOOD',
      team: [
        '616fbae4-7d94-11ea-bc55-0242ac131201'
      ]
    },
 */
const heroesSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 80,
    required: true
  },
  alignment: {
      type: String,
      minlength: 2,
      maxlength: 80,
      required: true
  },
  teams: {
    type: Array,
    of: teamsSchema,
    required: true
  }
});

const validateHeroes= {
  heros: Joi.object().keys({
    _id: Joi.objectId(),
    name: Joi.string()
      .min(2)
      .max(80)
      .required(),
    alignment: Joi.string()
    .min(2)
    .max(80)
    .required(),
    teams: Joi.array().items(
      Joi.object().keys({
        _id: Joi.objectId(),
        name: Joi.string()
          .min(2)
          .max(80)
          .required()
      }))
  }),
}
const Heroes = new mongoose.model("heroes", heroesSchema);

exports.Heroes = Heroes;
exports.heroesSchema = heroesSchema;
exports.validateHeroes = validateHeroes;
