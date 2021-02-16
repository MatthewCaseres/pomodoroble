var { summaryToUrlTree } = require("github-books");

(async () => {
  let tree = await summaryToUrlTree({
    url: "https://github.com/MatthewCaseres/mdExperiments/blob/main/tsts",
  })
  console.log(tree)
})()

