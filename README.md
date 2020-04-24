# Back End Engineering Challenge -- SuperHero Teams API
 express - mongodb - mongodb-memory-server - mongoose

# Dependencies
What you need to run this project:
- Node.js

(MongoDB is not required because it'll run in memory, handled by the package `mongodb-memory-server`).

# Try it out
## 1. Install dependencies
```
npm install
```
## 2. run app in dev
```
npm run dev
```
## 3. run tests
```
npm test

run above command to run the tests written using jest and supertest.

## Bonuses:

- I have implemented the bonus for calcuating the mena aligment based on the content of the group. 

- Rather than just display the teamId/superHeroId in the team and members list - i displaed an array of the record (superhero or team) - avoiding the recursive information


Express server is listening at - http://localhost:5000

Sample Request for Heros and Teams
````
#Teams
````` 
1) get Teams - GET -  http://localhost:5000/api/teams .
    get Team by ID - GET - http://localhost:5000/api/teams/:id

2) create Team - POST - http://localhost:5000/api/teams/save
req-body = {
      "name": "JusticeLeage",
      "meanAlignment": "GOOD",
      "heroes": [] }

3) save Hero to the Team - PUT -  http://localhost:5000/api/teams/saveHero
steps -
create a hero and team save _id's
req-body =  {
	"_id": "5ea230d9c11408266465532e",
	"heroes": ["5ea230d9c11408266465532b"]
    }

4) Delete Team - Delete - http://localhost:5000/api/teams/:id

5) Delete Hero from Group - Delete - http://localhost:5000/api/teams/:id/:heroId
  pass the teamId and hero Id as the path parameter.
```````  
#Heroes
``````
1) get heroes - GET -  http://localhost:5000/api/heroes .
    get hero by ID - GET - http://localhost:5000/api/heroes/:id

2) create heros - POST - http://localhost:5000/api/heroes/save
req-body = { "name": "SpiderMan",
      "alignment": "Neutral",
      "teams": [
      ]}

3) Delete hero - Delete - http://localhost:5000/api/heroes/:id
