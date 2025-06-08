"use server";

import fs from "fs/promises";
import path from "path";

const configPath = path.join(process.cwd(), "data", "config.json");

interface AppConfig {
  yearlyProgramUrl: string | null;
}

async function readConfig(): Promise<AppConfig> {
  try {
    const data = await fs.readFile(configPath, "utf-8");
    return JSON.parse(data) as AppConfig;
  } catch (error: unknown) {
    if ((error as { code: string }).code === "ENOENT") {
      // File doesn't exist, return default config
      return { yearlyProgramUrl: null };
    }
    console.error("Errore nella lettura del file di configurazione:", error);
    throw new Error("Impossibile leggere la configurazione.");
  }
}

async function writeConfig(config: AppConfig): Promise<void> {
  try {
    // Ensure the data directory exists
    const dataDir = path.dirname(configPath);
    await fs.mkdir(dataDir, { recursive: true });

    await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf-8");
  } catch (error) {
    console.error("Errore nel salvataggio del file di configurazione:", error);
    throw new Error("Impossibile salvare la configurazione.");
  }
}

export async function getYearlyProgramUrl(): Promise<string | null> {
  const config = await readConfig();
  return config.yearlyProgramUrl;
}

export async function setYearlyProgramUrl(url: string | null): Promise<void> {
  const config = await readConfig();
  config.yearlyProgramUrl = url;
  await writeConfig(config);
}
