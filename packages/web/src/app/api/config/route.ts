import fs from "fs";

export async function GET(request: Request) {
  const voiceConfig = fs.readFileSync(
    `${process.env.PROJECT_ROOT}/config/voice-config.json`,
    "utf-8"
  );

  return Response.json(JSON.parse(voiceConfig));
}

export async function POST(request: Request) {
  const res = await request.json();

  const voiceConfig = {
    languageCode: res.languageCode,
    name: res.name,
    pitch: res.pitch,
    ssmlGender: res.ssmlGender,
    speakingRate: res.speakingRate,
  };

  const activeConfig = JSON.parse(
    fs.readFileSync(
      `${process.env.PROJECT_ROOT}/config/voice-config.json`,
      "utf-8"
    )
  );

  fs.writeFileSync(
    `${process.env.PROJECT_ROOT}/config/voice-config.json`,
    JSON.stringify(
      {
        ...activeConfig,
        ...voiceConfig,
      },
      null,
      2
    )
  );

  return Response.json({
    ...activeConfig,
    ...voiceConfig,
  });
}
