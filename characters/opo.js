import { characterBase } from './base'

export const opo = {
  ...characterBase,
  name: 'Opo',
  maxHealth: 10,
  health: 10,
  maxResource: 10,
  resource: 10,
  power: 2,
  type: 'earth',
  speed: 2,
  critRate: 0.1,
  critDamage: 1.5,
  skills: [{ id: 'basic_attack', coolDown: 0 }],
  statuses: []
}
