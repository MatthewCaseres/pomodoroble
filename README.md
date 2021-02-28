## About

This is folder that I use for personal organization and analytics. Ultimately it should be like a timer mixed with a habit tracker mixed with a journal. Maybe I will even add a workout program.

In the scripts folder you will find scripts, which are also scripts in package.json.

## Instructions

npm or yarn install the dependencies. Then run

```
yarn pomo
# or
npm run pomo
```

which will run the pomodoro.js script. Remember to do something to not let the process pause when mac sleeps. This messes up the counter but the timestamps will remain intact, which is probably better for use in data analysis.

Data for your sessions is written to the `/sessions` folder.

## Taking a break
To take a break press `t`. Press `t` again to start working again. Press `x` to finish the timer.

## User data
User data for pomodoro.js is in the sessions folder, timestamps are UTC and time is measures in seconds in the JSON.

pomodoro2 data is saved to routines.
