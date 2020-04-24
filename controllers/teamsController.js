const { Heroes } = require("../models/Heroes");
const { Teams } = require("../models/Teams");
const asyncMiddleware = require("../middlewares/async");

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

 // - Demonstrate use of REST conventions, Include routes to:
// - add a superhero
// - add a team
// - add a superhero to the team (superheros may be members of more than one team)
//   - remove a group
//   - remove a superhero from a team
//   - remove a superhero
//   - retrieve a superhero by Id (including the teams they are part of)
//   - retrieve a team by Id (including the superheros on the team)

const getMeanAlignmet = function (heroList) {
    const sum = heroList.reduce((summary, hero)=> {
       summary[hero.alignment]+=1;
       return summary;
    }, {GOOD: 0, BAD:0, NEUTRAL:0})

    return Object.keys(sum).reduce((a, b) => sum[a] > sum[b] ? a : b);
 }

module.exports = {
  createOrUpdateTeams: asyncMiddleware(async (req, res) => {
    const errors = {};
    const { _id } = req.body || undefined;
    const {
     name,
     meanAlignment,
     heroes
    } = req.body;
    const teamFeilds = {};
    if (name) teamFeilds.name = name;
    if (meanAlignment) teamFeilds.meanAlignment = meanAlignment;
    teamFeilds.heroes = heroes || [];

    const Team = await Teams.findById(_id);
    if (Team) {
     teamFeilds.heroes = [...Team.heroes, teamFeilds.heroes];   
     const updateTeam = await Teams.findByIdAndUpdate(
       { _id },
       { $set: teamFeilds },
       { new: true }
     );
     return res.status(200).json(updateTeam);
   }
    const updateTeam = await new Teams(teamFeilds).save();

    res.status(200).json(updateTeam);
  }),

  addSuperHeroToTeam: asyncMiddleware(async(req, res, next) => {
    const errors = {};
    const { _id } = req.body || undefined;
    const updateTeam = {};
    const {
     heroes
    } = req.body;
    const team = await Teams.findById(_id);
    if(heroes.length === 0) {
        errors.empty = 'Heros Ids are Empty';
        return res.status(400).json(errors);
    }
    if(!team) {
        error.empty = 'Cannot find Team';
        return res.status(500).json(errors);
    }

    updateTeam._id = team.id;
    updateTeam.name= team.name;
    updateTeam.heroes = team.heroes || [];

    for(let id=0; id<heroes.length; id++) {
        const hero = await Heroes.findById(heroes[id]);
        if(hero) {
            const heroFields = {
                _id: hero.id,
                name: hero.name,
                alignment: hero.alignment,
                teams: hero.teams
            }
            heroFields.teams.push({
                _id: updateTeam._id,
                name: updateTeam.name
            });
           await Heroes.findByIdAndUpdate(
                { _id: hero.id },
                { $set: heroFields },
                { new: true }
              );
            updateTeam.heroes.push({
                _id: hero.id,
                name: hero.name,
                alignment: hero.alignment
            });
        }
    }
    updateTeam.meanAlignment = getMeanAlignmet(updateTeam.heroes);
    const updateTeamWithHeros = await Teams.findByIdAndUpdate(
        { _id },
        { $set: updateTeam },
        { new: true }
      );
      return res.status(200).json(updateTeamWithHeros);
  }),
  getTeams: asyncMiddleware(async (req, res) => {
    //req.protocol req.secure req.subdomains req.hostname req.baseUrl req.baseUrl req.params req.path req.query req.originalUrl
    const errors = {};
    const team = await Teams.find();
    //const products = await Product.find();
    if (!team) {
      errors.notFound = "Team not found";
      return res.status(404).json(errors);
    }
    res.status(200).json(team);
  }),

  getTeamsById: asyncMiddleware(async (req, res) => {
    const errors = {};
    const _id = req.value.params;
    const team = await Teams.findById({
      _id
    });
    if (!team) {
      errors.notFound = "Teams not found";
      return res.status(404).json(errors);
    }
    res.status(200).json(team);
  }),
deleteTeam: asyncMiddleware(async (req, res) => {
    const errors = {};
    const _id = req.value.params;
    const team = await Teams.findByIdAndRemove(_id);
    if (!team) {
        errors.notFound = "Team not found";
        return res.status(404).json(errors);
    }
    res.status(200).json({ success: true });
  }),

  deleteHeroFromTeam: asyncMiddleware(async (req, res) => {
      const errors = {};
      const {id, heroId}  = req.value.params;
      const team = await Teams.findById({_id: id});
      if(!team) {
        errors.notFound = "Team not found";
        return res.status(404).json(errors);
      }
      const hero = await Heroes.findById({_id: heroId});
      if(!hero) {
        errors.notFound = "Team not found";
        return res.status(404).json(errors);
      }
      team.heroes = [...team.heroes.filter(a => a._id.toString() !== heroId)]
      team.meanAlignment = getMeanAlignmet(team.heroes);
      await team.save();
      hero.teams = [...hero.teams.filter(a => a._id.toString() !== id)]
      await team.save();
      res.status(200).json({ success: true });
  })
};
