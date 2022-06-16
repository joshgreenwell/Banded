export const skillList = [
  {
    id: 'basic_attack',
    name: 'Attack',
    type: 'physical',
    power: 1,
    coolDown: 0,
    effects: ['damage'],
    cost: 0
  },
  {
    id: 'hamstring',
    name: 'Hamstring',
    type: 'physical',
    power: 1,
    coolDown: 5,
    effects: ['damage', 'atk_down'],
    cost: 1
  },
  {
    id: 'soothing_water',
    name: 'Soothing Water',
    type: 'water',
    power: 1,
    coolDown: 3,
    effects: ['heal'],
    cost: 3
  }
]

export const addSkillToList = (skill) => skillList.push(skill)
export const removeSkillFromList = (skill) =>
  skillList.filter((ls) => ls.id === skill.id)

const getEffectiveness = (skillType, charType) => {
  if (skillType === 'physical') return 0
  if (skillType === 'water' && charType === 'fire') return 1
  if (skillType === 'fire' && charType === 'earth') return 1
  if (skillType === 'earth' && charType === 'water') return 1
  if (skillType === 'fire' && charType === 'water') return -1
  if (skillType === 'water' && charType === 'earth') return -1
  if (skillType === 'earth' && charType === 'fire') return -1
  return 0
}

export const useSkill = (skillId, actingChar, affectedChar) => {
  const skill = skillList.find((skill) => skill.id === skillId)
  skill.effects.forEach((e) => {
    if (e === 'damage') {
      const isEffective = getEffectiveness(skill.type, affectedChar.type)
      const damage =
        isEffective > 0
          ? skill.power * actingChar.power * 1.25
          : isEffective < 0
          ? skill.power * actingChar.power * 0.75
          : skill.power * actingChar.power
      const atkDown = actingChar.statuses.find((s) => s.id === 'atk_down')
      const finalDamage = atkDown ? damage - damage * atkDown.amount : damage
      affectedChar.health -= finalDamage
    } else if (e === 'heal') {
      const heal = skill.power * actingChar.power
      actingChar.resource -= skill.cost
      affectedChar.health = Math.max(
        affectedChar.health + heal,
        affectedChar.maxHealth
      )
    } else if (e === 'atk_down') {
      affectedChar.statuses.push({ id: 'atk_down', amount: 0.1 })
    }
  })
  const index = actingChar.skills.findIndex((s) => s.id === skill.id)
  actingChar.skills[index].coolDown = skill.coolDown

  return skill
}
