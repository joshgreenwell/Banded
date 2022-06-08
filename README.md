# Banded

Banded is a turn based RPG

## Server

Our server will be a Express JS REST server. We want to create a simple game engine that can handle actions taken on a client and return the game state accordingly.

### API Documentation

|Method|Route|Returns|Params|
|---|---|---|---|
|POST|/session|string|User Credentials|
|GET|/state|State|Session Id|
|POST|/action|State|Session Id, Action|

**`POST /session`**

Create a session between a client and the server.
```http
POST http://localhost:3000/session
{
  "username": "username"
  "password": "password"
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

|Name|Description|Type|
|---|---|---|
|Session|A set of data relating to a particular client and sever connection.|Object|
|Action|A request from the client to make a change to the state|Object|
|Character|A set of stats and information that describe a character|Object|

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
