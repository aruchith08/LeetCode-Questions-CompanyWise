import { spawn } from 'child_process';

const cmd = 'D:\\Company-wise questions\\.agents\\skills\\impeccable\\scripts\\impeccable.cmd';
const args = ['live-poll', ...process.argv.slice(2)];

const child = spawn(`"${cmd}"`, args, {
  stdio: 'inherit',
  shell: true,
  windowsVerbatimArguments: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
