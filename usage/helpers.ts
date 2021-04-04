import {
  TimeBlock,
} from "../src";

export type Activity =
  | "food"
  | "speak"
  | "walk"
  | "open source"
  | "lift"
  | "read"
  | "wake up"
  | "chores"
  | "goggins"
  | "pomodoroBreak"
  | "AWS notes"
  | "school"
  | "strategizing"
  | "bike"
  | "yoga"
  | "shower"

export function morningMaker(activity: Activity, activity2?: Activity): TimeBlock<Activity>[] {
  return [
    {activity: "wake up", m:15, finishUnder: true},
    {activity, h: 1},
    {activity: "pomodoroBreak", m:10, finishUnder: true},
    {activity, h: 1},
    {activity: "pomodoroBreak", m:10, finishUnder: true},
    {activity, h: 1},
    {activity: "walk"},
    {activity: "food", m: 30, finishUnder: true},
    {activity: activity2 ?? activity, h: 1},
    {activity: "pomodoroBreak", m:10, finishUnder: true},
    {activity: activity2 ?? activity, h: 1},
  ]
}

function insertNewActivity(newTimeBlock: TimeBlock<Activity>) {
  return (timeBlocks: TimeBlock<Activity>[], i: number) => {
    const { start, ...notStarted } = timeBlocks[i];
    timeBlocks = [
      ...timeBlocks.slice(0, i + 1),
      { ...newTimeBlock },
      {
        ...notStarted,
        s:
          (notStarted?.s ?? 0) -
          (new Date().getTime() - start!.getTime()) / 1000,
      },
      ...timeBlocks.slice(i + 1),
    ];
    return timeBlocks;
  };
}

export const mappings: Record<
  string,
  (timeBlocks: TimeBlock<Activity>[], index: number) => TimeBlock<Activity>[]
> = {
  s: insertNewActivity({ activity: "speak" }),
  w: insertNewActivity({ activity: "walk" }),
  b: insertNewActivity({ activity: "bike" })
};
