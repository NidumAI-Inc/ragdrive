import { exec } from 'child_process';

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error)
      else resolve(stdout)
    })
  })
}

export default runCommand
