import readline, { cursorTo } from 'readline';
import fs from 'fs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export default async function cli() {
  rl.setPrompt('> ');
  rl.prompt();
  rl.on('line', (input) => {
    handleInput(input);
    rl.prompt();
  });

  //Redirect console.log to print above the prompt
  const originalLog = console.log;
  console.log = (...args) => {
    cursorTo(process.stdout, 0);
    originalLog.apply(console, args);
    rl.prompt(true);
    process.stdout.moveCursor(0, 1);
  };
}

function handleInput(input: string) {
  switch (input) {
    case 'exit':
      process.exit(0);
      break;
    case 'restart':
      process.exit(1);
      break;
    case 'rs':
      process.exit(1);
      break;
    default:
      console.log('Unknown command');
  }
}
