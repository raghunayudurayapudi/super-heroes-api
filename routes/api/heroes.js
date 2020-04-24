const express = require('express');
const router = express.Router();
const { getHeroes, createOrUpdateHeroes, getHerosById, deleteHero} = require('../../controllers/heroesController');
const { validateBody, validateParamId, schemas } = require('../../middlewares/validator');
const { validateHeroes } = require('../../models/Heroes');


router.get('/', getHeroes);
router.get('/:id', validateParamId(schemas.id), getHerosById);
router.post(
    "/save",
    [validateBody(validateHeroes.heros)],
    createOrUpdateHeroes
  );
router.delete('/:id', validateParamId(schemas.id), deleteHero);

module.exports = router;