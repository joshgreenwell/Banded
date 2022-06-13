import express from 'express'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb'
import { larion } from './characters/larion'
import { xixi } from './characters/xixi'

import { useSkill } from './skills'

const app = express()
const port = 3000
const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri)

let users
let sessions

const run = async () => {
  try {
    await client.connect()
    await client.db('Banded').command({ ping: 1 })

    users = await client.db('Banded').collection('users')
    sessions = await client.db('Banded').collection('sessions')

    console.log('Connected successfully to mongodb')
  } catch (e) {
    console.error(e)
  }
}
run()

app.use(express.json())
app.use(cors())

app.get('/user', async (req, res) => {
  try {
    const { username } = req.query

    const userDetails = await users.findOne({ username })

    return res.json(userDetails)
  } catch (e) {
    console.error(e)
    return res.sendStatus(500)
  }
})

app.post('/session', async (req, res) => {
  const { username } = req.body

  const user = await users.findOne({ username })
  if (!user) return res.json('')

  let sessionId

  const session = await sessions.findOne({ userId: user._id })
  try {
    if (!session) {
      sessionId = await createSession(user._id)
      console.log('Added new session:', sessionId)
    } else {
      sessionId = session._id
    }

    return res.json({ sessionId })
  } catch (e) {
    console.error(e)
    return res.sendStatus(500)
  }
})

app.get('/state', async (req, res) => {
  try {
    const { session } = req.query

    const sessionDetails = await sessions.findOne({ _id: ObjectId(session) })

    return res.json(sessionDetails?.state)
  } catch (e) {
    console.error(e)
    return res.sendStatus(500)
  }
})

app.post('/action', async (req, res) => {
  try {
    const { session, action } = req.body
    const sessionDetails = await sessions.findOne({ _id: ObjectId(session) })

    const newState = await takeAction(sessionDetails, action)

    return res.json(newState)
  } catch (e) {
    console.error(e)
    return res.sendStatus(500)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// -------------------
const createSession = async (userId) => {
  const result = await sessions.insertOne({
    userId,
    state: {
      current: 'idle'
    }
  })

  return result.insertedId
}

const takeAction = async (session, action) => {
  let state = { ...session.state }
  const user = await users.findOne({ _id: ObjectId(session.userId) })

  if (action.type === 'startCombat') {
    const enemy = getTeamForFightId(action.details.data.fightId)
    const team = await getTeamFromUuids(
      action.details.data.team,
      user.characters
    )
    const turnOrder = createTurnOrder(team, enemy)

    state.current = 'combat'
    state.combat = {
      team,
      enemy,
      turnLog: [],
      turnOrder,
      turn: 0
    }
  } else if (action.type === 'endCombat') {
    state = {
      current: 'idle'
    }
  } else if (action.type === 'takeTurn') {
    // TODO: Handle players trying to take multiple turns with the same unit
    if (action.details.type === 'skill') {
      // Take player action
      const character = state.combat.team.find(
        (c) => c.uuid === state.combat.turnOrder[state.combat.turn].uuid
      )
      // TODO: error if character.skills[action.details.data.skill].coolDown > 0
      // Reduce cooldowns by 1
      const skill = useSkill(
        character.skills[action.details.data.skill].id,
        character,
        state.combat.enemy[action.details.data.toWho]
      )
      state.combat.turnLog.push({
        action: action.details.type,
        skill,
        fromWho: character.name,
        toWho: state.combat.enemy[action.details.data.toWho].name
      })
    } else if (action.details.type === 'skip') {
      state.combat.turnLog.push({
        action: action.details.type,
        fromWho: state.combat.team.find(
          (c) => c.uuid === state.combat.turnOrder[state.combat.turn].uuid
        )?.name
      })
    }
    await advanceTurn(state)
  }

  await sessions.updateOne({ _id: ObjectId(session._id) }, { $set: { state } })
  return state
}

const advanceTurn = async (state) => {
  state.combat.turn += 1
  if (state.combat.turn >= state.combat.turnOrder.length) state.combat.turn = 0
  if (state.combat.turnOrder[state.combat.turn].isPlayer) {
    return state
  }
  // TODO: build AI to determine who to attack and with what
  // Take NPC action
  const npcId = state.combat.turnOrder[state.combat.turn].uuid
  const npc = state.combat.enemy.find((c) => c.uuid === npcId)
  const skill = useSkill(npc.skills[0].id, npc, state.combat.team[0])
  state.combat.turnLog.push({
    action: 'skill',
    skill,
    fromWho: npc.name,
    toWho: state.combat.team[0].name
  })
  return await advanceTurn(state)
}

const createTurnOrder = (team, enemy) =>
  [...enemy, ...team.map((c) => ({ ...c, isPlayer: true }))]
    .sort((a, b) => b.speed - a.speed)
    .map((c) => ({ isPlayer: c.isPlayer ?? false, uuid: c.uuid }))

const getTeamFromUuids = async (team, characters) =>
  team.map((id) => characters.find((c) => c.uuid === id))

const getTeamForFightId = (fightId) => {
  if (fightId === '0') {
    return [{ ...larion, uuid: '0' }]
  }
}
