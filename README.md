# Banded

Banded is a turn based RPG engine

## Goal

I think it would be fun and cool to create an adaptable turn based engine in JavaScript that can be connected to different UIs for different game experiences. To do this we need it to be relatively generic and modular.

With that in mind, we will create a set of features the engine performs and build them so they depend on each other a little as possible.

We will delineate between core and non-core systems. Core systems are the foundational systems that are needed for a turn based game to function. All additional systems are used to add to the game and are the optional modular pieces.

|Feature|Description|Core Feature|Complete|
|---|---|---|---|
|User System|The player object|Yes||
|Character System|Player characters and NPCs|Yes||
|Combat System|Turn logic|Yes||
|Stage Creation System|Generate NPC combinations to be fed into the combat system|Yes|
|Item System|Allows creation of items and connection to characters|No||
|Shop System|Ability to exchange in game currency for items or characters|No||
|Roll System|Used to randomly select a character or item for a user based on conditions|No||


## Server

Our server will be a Express JS REST server. We want to create a simple game engine that can handle actions taken on a client and return the game state accordingly.

### API Documentation

**Terms**

|Name|Description|
|---|---|
|Token|A string used for authentication of a user.|
|User Credentials|A username/password pair.|
|User|All the details of a user.|
|Session|A set of data relating to a particular client and sever connection.|
|Session Id|The unique id that identifies a session.|
|State|All the details of the game's current state.|
|Turn|The process of a player or NPC taking an action during combat.|
|Action|A request from the client to make a change to the state.|
|Character|A set of stats and information that describe a character.|
|Skill|A set of stats and information that describe a character's action in combat.|
|Status|An effect that is applied to a character from the use of a skill. Can be positive or negative.|


**Routes**

|Method|Route|Returns|Params|Requires Auth|
|---|---|---|---|---|
|POST|/login|Token|User Credentials|No|
|GET|/user|User|Username|Yes|
|POST|/session|Session Id||Yes|
|GET|/state|State|Session Id|Yes|
|POST|/action|State|Session Id, Action|Yes|

**Examples**

**`GET /user`**

Gets a user's public details.
```http
GET http://localhost:3000/user?username=username
```

**`POST /session`**

Create a session between a client and the server.
```http
POST http://localhost:3000/session
{
  "username": "username"
}
```

**`GET /state`**

Returns the current game state.
```http
GET http://localhost:3000/state?session=1234567890
```


**`POST /action`**

Takes the action passed, attempts to complete it, and sends back the relevant state for that action.
```http
POST http://localhost:3000/action
{
  "session": "1234567890",
  "action": {}
}
```
### Game Objects

**Session**
```typescript
{
  sessionId: string
  userId: string
}
```

**Action**
```typescript
{
  type: 'startCombat' | 'endCombat' | 'takeTurn'
  details: {
    type: 'transition' | 'skill' | 'skip'
    data?: Record<string, unknown>
  }
}
```

**Character**

`Skill`
```typescript
{
  name: string,
  type: 'physical' | 'water' | 'fire' | 'earth'
  power: number
  effect?: unknown
}
```

`Status`
```typescript
{
  name: string
  type: 'buff' | 'debuff'
  effect: unknown
}
```

`Character`
```typescript
{
  name: string
  level: number
  health: number
  resource: number
  power: number
  defense: number
  type: 'water' | 'fire' | 'earth'
  speed: number
  critRate: number
  critDamage: number
  skills: Skill[]
  statuses: Status[]
}
```
