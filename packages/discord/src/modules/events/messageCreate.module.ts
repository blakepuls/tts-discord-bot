import fs from 'fs';
import { createEventModule } from '@/types/EventModule';
import { log, speech } from '@lib/utils';
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';

const player: AudioPlayer = createAudioPlayer();
const queue: string[] = [];
let isPlaying: boolean = false;
let currentConnection: VoiceConnection | null = null;
let currentFile: string | null = null;

// Function to play the next message in the queue
async function playNext(): Promise<void> {
  if (queue.length > 0 && !isPlaying && currentConnection) {
    isPlaying = true;
    const nextFile: string | undefined = queue.shift();
    if (nextFile) {
      currentFile = nextFile; // Mark the current file for deletion after playing
      const resource = createAudioResource(nextFile);
      player.play(resource);
    }
  } else {
    isPlaying = false;
  }
}

player.on(AudioPlayerStatus.Idle, () => {
  isPlaying = false;
  if (currentFile) {
    fs.unlink(currentFile, (err) => {
      if (err) {
        console.error('Error deleting the file:', err);
      } else {
        console.log('File deleted successfully');
      }
    });
    currentFile = null; // Reset current file
  }
  playNext();
});

export const messageCreate = createEventModule({
  event: 'messageCreate',
  enabled: true,
  execute: async ({ client }, message) => {
    if (process.env.DISCORD_TTS_CHANNEL_ID !== message.channelId) return;

    // Get the voice channel the user is in
    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) return;

    const voiceConfig = JSON.parse(
      fs.readFileSync(`${process.env.PROJECT_ROOT}/config/voice-config.json`, 'utf-8'),
    );

    const outputFile = await speech.speak(message.content, {
      voice: {
        languageCode: voiceConfig.languageCode,
        name: voiceConfig.name,
        ssmlGender: voiceConfig.ssmlGender,
      },
      audio: {
        effectsProfileId: ['small-bluetooth-speaker-class-device'],
        pitch: voiceConfig.pitch,
        speakingRate: voiceConfig.speakingRate,
      },
    });

    // Add the generated audio file to the queue
    queue.push(outputFile);

    // Get channel by id
    if (!currentConnection) {
      currentConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild?.id!,
        adapterCreator: message.guild?.voiceAdapterCreator!,
      });

      currentConnection.subscribe(player);
      currentConnection.on(VoiceConnectionStatus.Ready, () => {
        playNext();
      });
    } else {
      playNext();
    }
  },
});
