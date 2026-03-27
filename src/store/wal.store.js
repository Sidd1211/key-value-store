import fs from 'fs';

const LOG_FILE = './wal.log';

export const appendLog = (entry) => {
  fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
};

export const replayLog = () => {
  if (!fs.existsSync(LOG_FILE)) return [];

  const lines = fs.readFileSync(LOG_FILE, 'utf-8').split('\n');

  return lines
    .filter(Boolean)
    .map(line => JSON.parse(line));
};