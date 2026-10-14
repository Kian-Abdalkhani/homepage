import { copyFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const favicon = fileURLToPath(import.meta.resolve("@abdalkhani/homelab-theme/icons/favicon.svg"));
const assets = new URL("../src/assets/", import.meta.url);
await mkdir(assets, { recursive: true });
await copyFile(favicon, new URL("favicon.svg", assets));
