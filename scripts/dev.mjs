import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const hostIndex = process.argv.indexOf("--host");
const portIndex = process.argv.indexOf("--port");
const host = hostIndex >= 0 ? process.argv[hostIndex + 1] : "127.0.0.1";
const port = portIndex >= 0 ? process.argv[portIndex + 1] : "4173";

const nextCli = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const child = spawn(process.execPath, [nextCli, "dev", "--hostname", host, "--port", port], {
  stdio: "inherit",
});

child.on("exit", (code) => process.exit(code ?? 0));
process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
