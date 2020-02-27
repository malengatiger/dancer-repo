import chalk = require('chalk')

export function log(msg: any) {
  console.log(msg);
}

export function logBlue(msg: any) {
  console.log(chalk.blue(msg))
}

export function logGreen(msg: any) {
  console.log(chalk.green(msg))
}