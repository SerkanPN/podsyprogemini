import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
fetch("https://api.runware.ai/v1", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify([
    {
      taskType: "authentication",
      apiKey: process.env.RUNWARE_API_KEY
    },
    {
      taskType: "imageInference",
      taskUUID: crypto.randomUUID(),
      positivePrompt: "test",
      initImage: "https://placehold.co/512x512/png",
      strength: 0.8,
      width: 512,
      height: 512,
      model: "rundiffusion:120@100"
    }
  ])
}).then(r => r.json()).then(console.log).catch(console.error);
