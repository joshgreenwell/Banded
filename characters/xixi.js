import { characterBase } from "./base"

export const xixi = {
  ...characterBase,
  name: 'Xixi',
  maxHealth: 10,
  health: 10,
  maxResource: 10,
  resource: 10,
  power: 2,
  type: 'fire',
  speed: 2,
  critRate: 0.1,
  critDamage: 1.5,
  skills: [
    {
      name: 'Basic',
      type: 'physical',
      power: 1
    }
  ],
  statuses: []
}