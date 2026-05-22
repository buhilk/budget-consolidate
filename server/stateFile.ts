import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const STATE_PATH = path.join(ROOT, 'data', 'state.json');

const DEFAULT_STATE = {
  centralBudget: 350_000,
  teams: [
    { id: '1', name: 'Platform', members: ['Ada', 'Ben'] },
    { id: '2', name: 'Design', members: ['Cara'] },
    { id: '3', name: 'Ops', members: [] },
  ],
};

export function isBudgetState(value: unknown): value is typeof DEFAULT_STATE {
  if (!value || typeof value !== 'object') return false;
  const { centralBudget, teams } = value as Record<string, unknown>;
  if (typeof centralBudget !== 'number' || !Number.isFinite(centralBudget) || centralBudget < 0) {
    return false;
  }
  if (!Array.isArray(teams)) return false;
  return teams.every(
    (t) =>
      t &&
      typeof t === 'object' &&
      typeof (t as Record<string, unknown>).id === 'string' &&
      typeof (t as Record<string, unknown>).name === 'string' &&
      Array.isArray((t as Record<string, unknown>).members) &&
      ((t as Record<string, unknown>).members as unknown[]).every((m) => typeof m === 'string'),
  );
}

export async function ensureStateFile(): Promise<void> {
  await fs.mkdir(path.dirname(STATE_PATH), { recursive: true });
  try {
    await fs.access(STATE_PATH);
  } catch {
    await fs.writeFile(STATE_PATH, JSON.stringify(DEFAULT_STATE, null, 2) + '\n', 'utf8');
  }
}

export async function readStateFile(): Promise<typeof DEFAULT_STATE> {
  await ensureStateFile();
  const raw = await fs.readFile(STATE_PATH, 'utf8');
  const data: unknown = JSON.parse(raw);
  if (!isBudgetState(data)) throw new Error('Invalid state.json shape');
  return data;
}

export async function writeStateFile(data: unknown): Promise<void> {
  if (!isBudgetState(data)) throw new Error('Invalid budget state');
  await fs.mkdir(path.dirname(STATE_PATH), { recursive: true });
  await fs.writeFile(STATE_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

export function stateApiMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
): void {
  const url = req.url?.split('?')[0];
  if (url !== '/api/state') {
    next();
    return;
  }

  if (req.method === 'GET') {
    readStateFile()
      .then((data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      })
      .catch((err: Error) => {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      });
    return;
  }

  if (req.method === 'PUT') {
    let body = '';
    req.on('data', (chunk: Buffer | string) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const data: unknown = JSON.parse(body);
        writeStateFile(data)
          .then(() => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          })
          .catch((err: Error) => {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: err.message }));
          });
      } catch {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}
