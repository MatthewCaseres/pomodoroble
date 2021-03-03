const logUpdate = require("log-update");
const _colors = require("colors");
var TimeFormat = require("hh-mm-ss");
const readline = require("readline");
const { Select } = require("enquirer");
const config = require('./pomodoro.json')
const fs = require("fs");
const path = require("path");
const { Parser } = require('json2csv');

const json2csvParser = new Parser();
const activityPrompt = new Select({
  name: "activity",
  message: "Which routine?",
  choices: Object.keys(config),
});

activityPrompt.run().then((choice) => {
  const timeBlocks = config[choice]
  timeBlocks[0].startTime = new Date();
  //Keeps track of current timeblock.
  let i = 0;
  readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  process.stdin.on("keypress", (str) => {
    if (str.match(/[0-9]/)) {
      timeBlocks[i].endTime = new Date();
      timeBlocks[i].mood = parseInt(str)
      if (i < timeBlocks.length - 1) {
        i++;
        timeBlocks[i].startTime = new Date();
      } else {
        finish(timeBlocks);
        process.exit(0);
      }
    }
  });
  setInterval(() => {
    logUpdate(displayTimeBlocks(timeBlocks));
  }, 80);
});

function displayTimeBlocks(timeBlocks) {
  return timeBlocks
    .map((timeblock) => displayTimeBlock(timeblock) + "\n")
    .join("");
}

function displayTimeBlock(timeBlock) {
  const secondsPassed = ~~(
    ((timeBlock.endTime ?? new Date()) - timeBlock.startTime) /
    1000
  );
  const totalSeconds = getGoalSeconds(timeBlock);
  return getTimeBlockColors(timeBlock)(
    `${timeBlock.activity} ${TimeFormat.fromS(
      secondsPassed
    )}/${TimeFormat.fromS(totalSeconds)} ${timeBlock.mood ?? ""}`
  );
}

function finish(timeBlocks) {
  //Convert goal and logged time to seconds for aggregation
  timeBlocks.forEach((timeBlock) => {
    timeBlock.goal = getGoalSeconds(timeBlock);
    timeBlock.logged = ~~((timeBlock.endTime - timeBlock.startTime) / 1000);
  });
  //Aggregate
  const totals = timeBlocks.reduce((aggregates, timeBlock) => {
    let newTotals = aggregates[timeBlock.activity] ?? {
      totalGoal: 0,
      totalLogged: 0,
    };
    newTotals.totalGoal = newTotals.totalGoal + timeBlock.goal;
    newTotals.totalLogged = newTotals.totalLogged + timeBlock.logged;
    if (timeBlock.less) {
      newTotals.less = true;
    }
    aggregates[timeBlock.activity] = newTotals;
    return aggregates;
  }, {});
  //Clean up data
  timeBlocks.forEach((timeBlock) => {
    delete timeBlock.h;
    delete timeBlock.m;
    delete timeBlock.s;
    if (!timeBlock.less) {
      timeBlock.less = false;
    }
  });
  console.log(timeBlocks);
  console.log(totals);
  const csv = json2csvParser.parse(timeBlocks);
  fs.writeFileSync(
    path.join(__dirname, "..", "routines", new Date().toISOString() + ".csv"),
    csv
  );
}

function getTimeBlockColors(timeBlock) {
  //If not started is white block
  if (!timeBlock.startTime) {
    return _colors.white;
  }
  const end = timeBlock.endTime ?? new Date()
  //Are we over or under the goal?
  let more =
    end >
    new Date(timeBlock.startTime.getTime() + 1000 * getGoalSeconds(timeBlock));
  //Things like breaks have a less attribute of true, so when under is green. Cause for checking.
  if (timeBlock.less) {
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
