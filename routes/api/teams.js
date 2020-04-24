const express = require('express');
const router = express.Router();
const { getTeams, createOrUpdateTeams,addSuperHeroToTeam, getTeamsById, deleteTeam, deleteHeroFromTeam } = require('../../controllers/teamsController');
const { validateBody, validateParamId, schemas, validateParamIdV2, schemasV2 } = require('../../middlewares/validator');
const { validateteams } = require('../../models/Teams');

router.get('/', getTeams);
router.get('/:id', validateParamId(schemas.id), getTeamsById);
router.post(
    "/save",
    [validateBody(validateteams.teams)],
    createOrUpdateTeams
  );
router.put(
    "/saveHero",
    [validateBody(validateteams.addHero)],
    addSuperHeroToTeam
);
router.delete('/:id', validateParamId(schemas.id), deleteTeam);
router.delete('/:id/:heroId', validateParamIdV2(schemasV2), deleteHeroFromTeam);
module.exports = router;