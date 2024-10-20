import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import OpenAI from "openai";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OPENAI_API_KEY =
  "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";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  mainWindow.loadFile("index.html");
}

app.on("ready", createWindow);

ipcMain.handle("get-diagnostic", async (event, patientData) => {
  const prompt = `Patient Details:
  Name: ${patientData.name}
  Age: ${patientData.age}
  Gender: ${patientData.gender}
  Symptoms: ${patientData.symptoms}

  Possible diagnostic:`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });
    console.log(response.choices[0].message.content.trim());
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API OpenAI", error);
    return "Impossible de générer un diagnostic pour le moment.";
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
