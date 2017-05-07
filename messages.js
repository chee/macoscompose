const chalk = require('chalk')

const warning = chalk.bold.yellow('warning')
const error = chalk.bold.red('error')

const unacceptablePlatform = chalk.white(
  'this will very likely only work on macOS'
)

const makeDirectoriesFailed = chalk.white(
  'failed to make keybindings directory'
)

module.exports = {
  warning,
  error,
  unacceptablePlatform,
  makeDirectoriesFailed
}
