import logUpdate from "log-update";
import _colors from "colors";
import TimeFormat from "hh-mm-ss";
import readline from "readline";

function pomodoro(timeBlocks, i = 0) {
  timeBlocks[i].start = new Date();
  const interval = setInterval(() => {
    logUpdate(displayTimeBlocks(timeBlocks));
  }, 1000);
  return new Promise((resolve, reject) => {
    readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    process.stdin.on("keypress", (str) => {
      if (str.match(/[0-9]/)) {
        clearInterval(interval)
        timeBlocks[i].end = new Date();
        timeBlocks[i].focus = parseInt(str);
        if (i < timeBlocks.length - 1) {
          return pomodoro(timeBlocks, i+1)
        } else {
          finish(timeBlocks);
          resolve('lol')
        }
      }
    });
  })
}

(async () => {
  const dug = await pomodoro([{ activity: "open source" }])
  console.log('res', dug)
  console.log('res')
})()


function displayTimeBlocks(timeBlocks) {
  return timeBlocks
    .map((timeblock) => displayTimeBlock(timeblock) + "\n")
    .join("");
}

function displayTimeBlock(timeBlock) {
  const secondsPassed = timeBlock.start
    ? ~~(
        ((timeBlock.end?.getTime() ?? new Date().getTime()) -
          timeBlock.start?.getTime()) /
        1000
      )
    : 0;
  const totalSeconds = getGoalSeconds(timeBlock);
  return getTimeBlockColors(timeBlock)(
    `${timeBlock.activity} ${TimeFormat.fromS(
      secondsPassed
    )}/${TimeFormat.fromS(totalSeconds)} ${timeBlock.focus ?? ""}`
  );
}

function finish(timeBlocks) {
  let loggedBlocks = timeBlocks.map((timeBlock) => {
    const goalSeconds = getGoalSeconds(timeBlock);
    const { h, m, s, ...withoutGoal } = timeBlock;
    //If neither start nor end is 0, if only start is up to date.
    const loggedSeconds =
      (timeBlock.end?.getTime() ?? new Date().getTime()) -
      (timeBlock.start?.getTime() ?? new Date().getTime());
    return { ...withoutGoal, goalSeconds, loggedSeconds };
  });
  //Aggregate
  const totals = loggedBlocks.reduce((aggregates, loggedBlock) => {
    let newTotals = aggregates[loggedBlock.activity] ?? {
      totalGoal: 0,
      totalLogged: 0,
    };
    newTotals.totalGoal = newTotals.totalGoal + loggedBlock.goalSeconds;
    newTotals.totalLogged = newTotals.totalLogged + loggedBlock.loggedSeconds;
    if (loggedBlock.finishUnder) {
      newTotals.finishUnder = true;
    }
    aggregates[loggedBlock.activity] = newTotals;
    return aggregates;
  }, {});
  return loggedBlocks
  // console.log(loggedBlocks);
  // console.log(totals);
}

function getTimeBlockColors(timeBlock) {
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

function getGoalSeconds(timeBlock) {
  return (
    (timeBlock.h ?? 0) * 3600 + (timeBlock.m ?? 0) * 60 + (timeBlock.s ?? 0)
  );
}
