import { pomodoro, TimeBlock, getGoalSeconds } from "../src";
import { Activity, morningMaker, mappings } from "./helpers";
import { DateTime } from "luxon";
import creds from './quickstart-1616322348990-091ee56eedde.json';
import { GoogleSpreadsheet } from 'google-spreadsheet';

(async () => {
  let pom = await pomodoro<Activity>([{ activity: "open source"}], mappings);
  // let pom = await pomodoro<Activity>(morningMaker("strategizing"), mappings);

  const doc = new GoogleSpreadsheet('1Qq13N2dgpU8TWwLLJKsmauKQM1Damvykkn2nOnFQ56A');
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Log'];
  let logs = pom.map(log => ({
    activity: log.activity,
    start: DateTime.fromJSDate(log.start!).toFormat('L/d/yyyy H:mm:ss'),
    end: DateTime.fromJSDate(log.end!).toFormat('L/d/yyyy H:mm:ss'),
    hours: log.loggedSeconds/3600
  }))
  await sheet.addRows(logs);
  process.exit();
})();
