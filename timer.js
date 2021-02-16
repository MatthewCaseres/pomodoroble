const fs = require("fs");
const readline = require("readline");
const { Select, Form } = require("enquirer");
const _colors = require("colors");
const cliProgress = require("cli-progress");
var TimeFormat = require("hh-mm-ss");
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

class MyTimer {
  constructor(activity, { goal, block, breakLen }) {
    this.logs = [];
    this.seconds = 0;
    this.goal = goal;
    this.blockLen = block;
    this.breakLen = breakLen;
    this.total = 0;
    this.activity = activity;
    this.break = false;
    this.timer = null;
    const multibar = new cliProgress.MultiBar({
      format: `{type} [${_colors.cyan("{bar}")}] {progress}`,
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true,
    });
    this.blockBar = multibar.create(parseInt(block) * 60, 0);
    this.totalBar = multibar.create(parseInt(goal) * 60 * 60, 0);
    this.breakBar = multibar.create(parseInt(breakLen) * 60, 0);
  }
  start() {
    this.timer = setInterval(() => {
      if (this.break) {
        this.seconds++;
        this.breakBar.update(Math.round(this.seconds), {
          type: "break",
          progress:
            TimeFormat.fromS(this.breakLen * 60 - this.seconds) + " until work",
        });
        this.blockBar.update(0, { type: "block", progress: "breaking" });
      } else {
        this.seconds++;
        this.total++;
        this.totalBar.update(Math.round(this.total), {
          type: "total",
          progress:
            TimeFormat.fromS(this.total, "hh:mm:ss") + ` of ${this.goal} Hours`,
        });
        this.blockBar.update(Math.round(this.seconds), {
          type: "block",
          progress:
            TimeFormat.fromS(this.blockLen * 60 - this.seconds) +
            " until break",
        });
        this.breakBar.update(0, { type: "break", progress: "working" });
      }
    }, 1000);
  }
  toggle() {
    this.logs = [
      ...this.logs,
      { activity: this.break ? "break" : this.activity, time: this.seconds },
    ];
    this.break = !this.break;
    this.seconds = 0;
    this.breakBar.update(0);
  }
  finish() {
    this.logs = [
      ...this.logs,
      { activity: this.break ? "break" : this.activity, time: this.seconds },
    ];
    fs.writeFileSync(
      "sessions/" + new Date().toISOString() + ".json",
      JSON.stringify({
        activity: this.activity,
        goal: this.goal,
        blockLen: this.blockLen,
        breakLen: this.breakLen,
        logs: this.logs,
      })
    );
  }
}

const activityPrompt = new Select({
  name: "activity",
  message: "What are you doing",
  choices: ["Open Source", "School"],
});
const activityTime = new Form({
  name: "user",
  message: "Please provide the following information:",
  choices: [
    { name: "goal", message: "Total Length (hrs)", initial: "3" },
    { name: "block", message: "Block Length (mins)", initial: "25" },
    { name: "breakLen", message: "Break Length (mins)", initial: "5" },
  ],
});

activityPrompt
  .run()
  .then((activity) => {
    activityTime
      .run()
      .then((hours) => {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        let t = new MyTimer(activity, hours);
        process.stdin.on("keypress", (str) => {
          if (str === "t") {
            t.toggle();
          } else if (str === "x") {
            t.finish();
            process.exit(0);
          }
        });
        process.on("beforeExit", () => {
          t.finish();
        });

        t.start();
      })
      .catch(console.error);
  })
  .catch(console.error);
