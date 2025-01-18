const blastsound = new Audio('./sound/blast.mp3');
const bluetilesound = new Audio('./sound/bluetile.mp3');
const greentilesound = new Audio('./sound/greentile.mp3');
const bombsound = new Audio('./sound/bomb.mp3');
const confusesound = new Audio('./sound/confuse.mp3');
const hiddenendsound = new Audio('./sound/hiddenend.mp3');
const normalendsound = new Audio('./sound/normalend.mp3');
const shovelsound = new Audio('./sound/shovel.mp3');
const snacksound = new Audio('./sound/snack.mp3');
const stairsound = new Audio('./sound/stair.mp3');
const trapsound = new Audio('./sound/trap.mp3');
const gameoversound = new Audio('./sound/gameover.mp3');
const getbombsound = new Audio('./sound/getbomb.mp3');

// 개별 사운드 재생 함수
export function playblast() {
  playSound(blastsound);
}
export function playbluetile() {
  playSound(bluetilesound);
}
export function playgreentile() {
  playSound(greentilesound);
}
export function playbomb() {
  playSound(bombsound);
}
export function playconfuse() {
  playSound(confusesound);
}
export function playhiddenend() {
  playSound(hiddenendsound);
}
export function playnormalend() {
  playSound(normalendsound);
}
export function playshovel() {
  playSound(shovelsound);
}
export function playsnack() {
  playSound(snacksound);
}
export function playstair() {
  playSound(stairsound);
}
export function playtrap() {
  playSound(trapsound);
}
export function playgameover() {
  playSound(gameoversound);
}
export function playgetbombsound() {
  playSound(getbombsound);
}

// 공통 사운드 재생 및 정지 함수
function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch((error) => console.error(`Failed to play sound: ${error}`));
}

export function stopSound(sound) {
  sound.pause();
}