import { characterBase } from './base'

export const ardd = {
  ...characterBase,
  name: 'Ardd',
  maxHealth: 11,
  health: 11,
  maxResource: 8,
  resource: 8,
  power: 3,
  type: 'water',
  speed: 2,
  critRate: 0.1,
  critDamage: 1.5,
  skills: [
    { id: 'basic_attack', coolDown: 0 },
    { id: 'soothing_water', coolDown: 0 }
  ],
  statuses: []
}
