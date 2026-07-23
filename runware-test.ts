import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

fetch("https://api.runware.ai/v1", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify([
    { taskType: "authentication", apiKey: process.env.RUNWARE_API_KEY },
    {
      taskType: "imageInference",
      taskUUID: crypto.randomUUID(),
      positivePrompt: "A room with a framed poster. The poster contains a highly detailed flat vector design of a vintage sunset with a mountain.",
      initImage: "https://placehold.co/512x512/png", // We will use the etsy image in reality
      strength: 0.8,
      width: 512,
      height: 512,
      model: "rundiffusion:120@100"
    }
  ])
}).then(r => r.json()).then(console.log).catch(console.error);
