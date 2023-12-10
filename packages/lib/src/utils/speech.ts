import textToSpeech, {
  protos,
  TextToSpeechClient,
} from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';

let fileCounter = 0; // Counter for file naming

interface SpeechOptions {
  voice: protos.google.cloud.texttospeech.v1.IVoiceSelectionParams;
  audio?: protos.google.cloud.texttospeech.v1.IAudioConfig;
}

export const speak = async (
  text: string,
  options: SpeechOptions,
): Promise<string> => {
  const client = new TextToSpeechClient();

  console.log('options', options);

  const [response] = await client.synthesizeSpeech({
    input: { text: text },
    voice: options.voice,
    // voice: {
    //   languageCode: 'en-US',
    //   name: 'en-US-Neural2-F',
    //   ssmlGender: 'FEMALE',
    // },
    audioConfig: {
      ...options.audio,
      audioEncoding: 'LINEAR16',
      effectsProfileId: ['small-bluetooth-speaker-class-device'],
      sampleRateHertz: 24000,
    },
  });

  if (!response.audioContent) {
    throw new Error('No audio content found');
  }

  const writeFile = util.promisify(fs.writeFile);
  const fileName = `message_${fileCounter++}.wav`; // Generate unique file name
  await writeFile(
    `${process.env.AUDIO_CACHE_PATH}/${fileName}`,
    response.audioContent,
    'binary',
  );
  return `${process.env.AUDIO_CACHE_PATH}/${fileName}`;
};
