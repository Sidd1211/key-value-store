import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const NODE_ID = process.env.NODE_ID || 'node1';
export const SELF_URL = process.env.SELF_URL || 'http://localhost:3000';

export const NODES = process.env.NODES
  ? process.env.NODES.split(',')
  : [];

export const REPLICATION_FACTOR = 2;
export const WRITE_QUORUM = 2;
export const READ_QUORUM = 1;