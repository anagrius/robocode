import actions from './actions';

export function createAction(action, payload = null) {
  return {
    action: action,
    payload: payload
  };
}

export function moveRandomly() {
  return createAction(Actions.MOVE, sample(Directions));
}

export function chargeShield() {
  return createAction(Actions.CHARGE_SHIELD);
}

export function attackRandomly() {
  return createAction(Actions.ATTACK, sample(Directions));
}

export function randomAction() {
  const randomActions = [
    moveRandomly,
    chargeShield,
    attackRandomly
  ];
  return sample(randomActions)();
}
