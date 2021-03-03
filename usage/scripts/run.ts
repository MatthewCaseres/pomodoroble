import { pomodoro, TimeBlock, TimeInput, getGoalSeconds, pomodoroMaker} from "../../src";
import {Activity} from './helpers'
import fs from "fs"
import path from "path"

const pomBlocks = pomodoroMaker<Activity>({activity: "AWS notes", blocks: 3, blockLength: {h: 1}, breakLength: {m: 10}});
(async () => {
  let fudge = await pomodoro<Activity>(pomBlocks);
  fs.writeFileSync(path.join(__dirname, "..", "time", new Date().toISOString() + ".json"), JSON.stringify(fudge))
  process.exit()
})();
