import logUpdate from "log-update";
import _colors from "colors";
import TimeFormat from "hh-mm-ss";
import readline from "readline";

export type TimeInput = {
  h?: number;
  m?: number;
  s?: number;
};
export type TimeBlock<T extends string = string> = {
  activity: T;
  finishUnder?: boolean;
  start?: Date;
  end?: Date;
} & TimeInput;

export async function pomodoro<T extends string = string>(
  timeBlocks: TimeBlock<T>[]
): Promise<(TimeBlock & { goalSeconds: number; loggedSeconds: number })[]> {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  return new Promise((resolve, reject) => {
    let i = 0;
    timeBlocks[i].start = new Date();
    const interval = setInterval(() => {
      logUpdate(displayTimeBlocks(timeBlocks));
    }, 200);
    //Keeps track of current timeblock.
    process.stdin.on("keypress", (str, key) => {
      if (key && (key.name == "enter" || key.name == "return")) {
        timeBlocks[i].end = new Date();
        if (i < timeBlocks.length - 1) {
          i++;
          timeBlocks[i].start = new Date();
        } else {
          resolve(finish(timeBlocks));
          clearInterval(interval);
        }
      } else if (str === "\x03") {
        process.exit();
      }
    });
  });
}

function displayTimeBlocks(timeBlocks: TimeBlock[]) {
  return timeBlocks
    .map((timeblock) => displayTimeBlock(timeblock) + "\n")
    .join("");
}

function displayTimeBlock(timeBlock: TimeBlock) {
  const secondsPassed = timeBlock.start
    ? Math.floor(
        ((timeBlock.end?.getTime() ?? new Date().getTime()) -
          timeBlock.start?.getTime() ?? 0) / 1000
      )
    : 0;
  const totalSeconds = getGoalSeconds(timeBlock);
  return getTimeBlockColors(timeBlock)(
    `${timeBlock.activity} ${TimeFormat.fromS(
      secondsPassed
    )}/${TimeFormat.fromS(totalSeconds)}`
  );
}

function finish(timeBlocks: TimeBlock[]) {
  let loggedBlocks = timeBlocks.map((timeBlock) => {
    const goalSeconds = getGoalSeconds(timeBlock);
    const { h, m, s, ...withoutGoal } = timeBlock;
    //If neither start nor end is 0, if only start is up to date.
    const loggedSeconds =
      ((timeBlock.end?.getTime() ?? new Date().getTime()) -
        (timeBlock.start?.getTime() ?? new Date().getTime())) /
      1000;
    return { ...withoutGoal, goalSeconds, loggedSeconds };
  });
  return loggedBlocks;
}

function getTimeBlockColors(timeBlock: TimeBlock) {
  //If not started is white block
  if (!timeBlock.start) {
    return _colors.white;
  }
  const end = timeBlock.end ?? new Date();
  //Are we over or under the goal?
  let more =
    end >
    new Date(timeBlock.start.getTime() + 1000 * getGoalSeconds(timeBlock));
  //Things like breaks have a less attribute of true, so when under is green. Cause for checking.
  if (timeBlock.finishUnder) {
    if (more) {
      return _colors.red;
    } else {
      return _colors.green;
    }
  } else {
    if (more) {
      return _colors.green;
    } else {
      return _colors.red;
    }
  }
}

function getGoalSeconds(timeInput: TimeInput) {
  return (
    (timeInput.h ?? 0) * 3600 + (timeInput.m ?? 0) * 60 + (timeInput.s ?? 0)
  );
}
