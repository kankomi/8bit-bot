export const MAX_LEVEL = 100;
export const MAX_LEVEL_EXP = 100000000;
export const FIRST_LEVEL_EXP = 1000;

// experience gained
export const MESSAGE_EXP = 10;
export const VOICE_PER_M_EXP = 1;
export const GIVE_REACTION_EXP = 5;
export const RECEIVE_REACTION_EXP = 10;

const B = Math.log(MAX_LEVEL_EXP / FIRST_LEVEL_EXP) / (MAX_LEVEL - 1);
const A = FIRST_LEVEL_EXP / (Math.exp(B) - 1);

export function calculateExpForLevel(level: number): number {
  const x = Math.round(A * Math.exp(B * (level - 1)));
  const y = Math.round(A * Math.exp(B * level));

  return y - x - FIRST_LEVEL_EXP;
}

function allLevels() {
  const lvls = [];
  for (let i = 1; i <= MAX_LEVEL; i++) {
    lvls.push(calculateExpForLevel(i));
  }
  return lvls;
}

const LEVELS = allLevels();

export function getLevelForExp(exp: number): number {
  for (let i = 0; i < LEVELS.length; i++) {
    if (LEVELS[i] > exp) {
      return i;
    }
  }
  return MAX_LEVEL;
}

export function getExpForLevel(level: number): number {
  if (level - 1 < 0) {
    return LEVELS[0];
  }

  if (level - 1 > LEVELS.length) {
    return LEVELS[LEVELS.length - 1];
  }

  return LEVELS[level - 1];
}
