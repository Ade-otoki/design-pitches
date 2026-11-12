import fs from "node:fs";
import path from "node:path";
import type { ProductLog } from "./types";

const DIR = path.join(process.cwd(), "content");

export function allLogs(): ProductLog[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as ProductLog)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getLog(slug: string): ProductLog | undefined {
  const file = path.join(DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return undefined;
  return JSON.parse(fs.readFileSync(file, "utf8")) as ProductLog;
}
