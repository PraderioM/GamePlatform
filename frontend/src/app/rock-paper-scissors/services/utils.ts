import {assetsPath} from './constants';


export function getModifierImage(modifier: string): string {
  const modifiersPath = assetsPath.concat('/modifiers');
  return modifiersPath.concat('/').concat(modifier).concat('.png');
}

export function getPlayImage(play?: number): string {
  const playsPath = assetsPath.concat('/plays');
  if (play === null) {
    return playsPath.concat('/do_something.png');
  } else if (play === 0) {
    return playsPath.concat('/time_machine.png');
  } else if (play === 1) {
    return playsPath.concat('/rock.png');
  } else if (play === 2) {
    return playsPath.concat('/paper.png');
  } else if (play === 3) {
    return playsPath.concat('/scissors.png');
  } else if (play === 4) {
    return playsPath.concat('/lizard.png');
  } else if (play === 5) {
    return playsPath.concat('/Spock.png');
  } else {
    return playsPath.concat('/shrug.png');
  }
}

export function getPlayName(play?: number): string {
  if (play === null) {
    return 'not played';
  } else if (play === 0) {
    return 'time machine';
  } else if (play === 1) {
    return 'rock';
  } else if (play === 2) {
    return 'paper';
  } else if (play === 3) {
    return 'scissors';
  } else if (play === 4) {
    return 'lizard';
  } else if (play === 5) {
    return 'Spock';
  } else {
    return 'whatever '.concat((play - 5).toString());
  }
}
