import creds from './quickstart-1616322348990-091ee56eedde.json';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { DateTime } from "luxon";

type Habits = {
  "Date": string,
  "Work By 4 A.M.": boolean,
  "No Internet Before Work": boolean
  "Morning Pomodoro": boolean,
  "Exercise": boolean,
  "Cold Shower": boolean,
  "No Porn": boolean,
  "Eat Veggies, Drink Water": boolean,
  "No Media (NPR, CNN, HackerNews), focus on yourself": boolean
}

(async () => {
  const doc = new GoogleSpreadsheet('1Qq13N2dgpU8TWwLLJKsmauKQM1Damvykkn2nOnFQ56A');
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Habits'];
  let dailyHabits: Habits = {
    "Date": DateTime.fromJSDate(new Date()).toFormat('L/d/yyyy'),
    "Work By 4 A.M.": true,
    "No Internet Before Work": true,
    "Morning Pomodoro": false,
    "Exercise": true,
    "Cold Shower": false,
    "No Porn": true,
    "Eat Veggies, Drink Water": false,
    "No Media (NPR, CNN, HackerNews), focus on yourself": false
  }
  await sheet.addRow(dailyHabits);
})();