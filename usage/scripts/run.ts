import pomodoro, { TimeBlock, TimeInput, getGoalSeconds } from "../../src";

type Activity =
  "break"
  | "speak"
  | "walk"
  | "open source"
  | "lift"
  | "code"
  | "AWS notes"
  | "AWS problems"
  | "read";
type TypedBlock = TimeBlock<Activity>

type PomodoroMakerInputs = {activity: Activity, blocks: number, blockLength: TimeInput, breakLength: TimeInput}
function pomodoroMaker({activity, blocks, blockLength, breakLength}: PomodoroMakerInputs) {
  let onWork: TypedBlock = {activity, ...blockLength}
  let onBreak: TypedBlock = {activity: "break", ...breakLength, finishUnder: true}
  let pom: TypedBlock[] = [{...onWork}]
  for (let i = 1; i < blocks; i++) {
    pom = [...pom, {...onBreak}, {...onWork}]
  }
  return pom
}
const pomBlocks = pomodoroMaker({activity: "open source", blocks: 15, blockLength: {h: 1}, breakLength: {m: 10}});

(async () => {
  let fudge = await pomodoro<Activity>(pomBlocks);
  console.log(fudge)
  process.exit()
})();
