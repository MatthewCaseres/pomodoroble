import pomodoro, { TimeBlock, TimeInput, getGoalSeconds } from "..";

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
  let onBreak: TypedBlock = {activity: "break", ...breakLength}
  let pom: TypedBlock[] = [onWork]
  for (let i = 1; i < blocks; i++) {
    pom = [...pom, onBreak, onWork]
  }
  return pom
}
const pomBlocks = pomodoroMaker({activity: "open source", blocks: 3, blockLength: {h: 1}, breakLength: {m: 10}});

(async () => {
  let fudge = await pomodoro<Activity>([{activity: "open source"}, {activity: "open source"}]);
  console.log(fudge)
  process.exit()
})();

// Aggregate;
// const totals = loggedBlocks.reduce((aggregates, loggedBlock) => {
//   let newTotals = aggregates[loggedBlock.activity] ?? {
//     totalGoal: 0,
//     totalLogged: 0,
//   };
//   newTotals.totalGoal = newTotals.totalGoal + loggedBlock.goalSeconds;
//   newTotals.totalLogged = newTotals.totalLogged + loggedBlock.loggedSeconds;
//   if (loggedBlock.finishUnder) {
//     newTotals.finishUnder = true;
//   }
//   aggregates[loggedBlock.activity] = newTotals;
//   return aggregates;
// }, {} as Record<string, { totalGoal: number; totalLogged: number; finishUnder?: boolean }>);
