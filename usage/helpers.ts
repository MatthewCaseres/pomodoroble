import { TimeBlock } from "../src";

export const possibleActivities = {
  walk: "notWork",
  food: "chore",
  "open source": "work",
  "wake up": "chore",
  pomodoroBreak: "work",
  school: "work",
  shower: "chore",
  cardio: "notWork",
  lift: "notWork",
} as const;

export type Activity = keyof typeof possibleActivities;

export function morningMaker(
  activity: Activity,
  activity2?: Activity
): TimeBlock<Activity>[] {
  return [
    { activity: "wake up", m: 15, finishUnder: true },
    { activity, h: 1 },
    { activity: "pomodoroBreak", m: 10, finishUnder: true },
    { activity, h: 1 },
    { activity: "pomodoroBreak", m: 10, finishUnder: true },
    { activity, h: 1 },
    { activity: "walk" },
    { activity: "food", m: 30, finishUnder: true },
    { activity: activity2 ?? activity, h: 1 },
    { activity: "pomodoroBreak", m: 10, finishUnder: true },
    { activity: activity2 ?? activity, h: 1 },
  ];
}
