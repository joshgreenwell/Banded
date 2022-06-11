export const skillList = [
  {
    id: 'basic_attack',
    name: 'Attack',
    type: 'physical',
    power: 1,
    coolDown: 0,
    effects: ['damage']
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
      affectedChar.health -= damage
    }
  })
  const index = actingChar.skills.findIndex((s) => s.id === skill.id)
  actingChar.skills[index].coolDown = skill.coolDown

  return skill
}
