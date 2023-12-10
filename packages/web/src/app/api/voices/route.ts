import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  // Load Google credentials from your project configuration
  const credentials = JSON.parse(
    fs.readFileSync(
      path.resolve(
        `${process.env.PROJECT_ROOT}/config/google-credentials.json`
      ),
      "utf8"
    )
  );

  // Create a client for Text-to-Speech
  const client = new TextToSpeechClient({ credentials });

  const [result] = await client.listVoices({ languageCode: "en" });

  return Response.json(result.voices);
}
