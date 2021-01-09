const fs = require('fs')

const wait = (time) => new Promise((resolve) => {
  setTimeout(resolve, time)
})

const waitForFile = async (path, maxTimeBetweenWrites = 500, timeBetweenExistenceChecks = 500) => {
  try {
    let changedSince = true
    const watcher = fs.watch(path, () => {
      changedSince = true
    })

    while (changedSince) {
      changedSince = false
      await wait(maxTimeBetweenWrites)
    }

    watcher.close()
  } catch (err) {
    if (err.code === 'ENOENT') {
      await wait(timeBetweenExistenceChecks)
      return waitForFile(path, maxTimeBetweenWrites, timeBetweenExistenceChecks)
    }
    throw err
  }
}

module.exports = {
  wait,
  waitForFile
}
