## About

This is folder that I use for personal organization and analytics. Ultimately it should be like a timer mixed with a habit tracker mixed with a journal. Maybe I will even add a workout program.

In the scripts folder you will find scripts, which are also scripts in package.json.

Right now the only script is the pomodoro script, but I have some ideas for journaling as well. My journal is manual right now, you can find it in `/journal`. Remember to not let your computer sleep while the timer is running. This isn't an issue when you're writing code, but if you're doing something like working out, it can be a problem. On mac you can fix this by using caffeine.

## Instructions

npm or yarn install the dependencies. Then run

```
yarn pomo
# or
npm run pomo
```

which will run the pomodoro.js script.

## Taking a break
To take a break press `t`. Press `t` again to start working again. Press `x` to finish the timer.

## User data
User data is in the sessions folder, timestamps are UTC and time is measures in seconds in the JSON.
