const { spawn } = require("child_process");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const reactScriptsStart = require.resolve("react-scripts/scripts/start");
const backendEntry = path.join(rootDir, "backend", "server.js");

function startProcess(name, command, args, cwd) {
  const child = spawn(command, args, {
    cwd,
    env: {
      ...process.env,
      BROWSER: "none"
    },
    stdio: "inherit",
    shell: false
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) {
      return;
    }

    const motivo = signal ? `sinal ${signal}` : `codigo ${code}`;
    exits[name] = { code: code ?? 0, signal: signal ?? null };

    if ((code ?? 0) !== 0) {
      console.log(`[${name}] finalizado com ${motivo}. Encerrando os demais processos...`);
      shutdown(code || 1);
      return;
    }

    console.log(`[${name}] finalizado com ${motivo}.`);

    if (Object.keys(exits).length === processes.length) {
      shutdown(0);
    }
  });

  child.on("error", (error) => {
    console.error(`[${name}] falhou ao iniciar:`, error);
    shutdown(1);
  });

  return child;
}

let shuttingDown = false;
const exits = {};
const processes = [
  startProcess("frontend", process.execPath, [reactScriptsStart], rootDir),
  startProcess("backend", process.execPath, [backendEntry], rootDir)
];

function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of processes) {
    if (!child.killed) {
      child.kill("SIGINT");
    }
  }

  setTimeout(() => {
    process.exit(exitCode);
  }, 300);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
