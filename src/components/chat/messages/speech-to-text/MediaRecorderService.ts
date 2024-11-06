const TIMESLICE_MS = 1000;

class WhisperingError extends Error {
  constructor(title: string, description: string) {
    super(`${title}: ${description}`);
    this.name = 'WhisperingError';
  }
}

export class MediaRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  get recordingState(): RecordingState {
    if (!this.mediaRecorder) return 'inactive';
    return this.mediaRecorder.state as RecordingState;
  }

  async startRecording(): Promise<void> {
    if (this.mediaRecorder) {
      throw new WhisperingError(
        'Unexpected media recorder already exists',
        'It seems like it was not properly deinitialized after the previous stopRecording or cancelRecording call.'
      );
    }

    try {
      const stream = await this.getMediaStream();
      this.mediaRecorder = new MediaRecorder(stream, { bitsPerSecond: 64000 });

      this.mediaRecorder.addEventListener('dataavailable', (event: BlobEvent) => {
        if (event.data.size) {
          this.recordedChunks.push(event.data);
        }
      });

      this.mediaRecorder.start(TIMESLICE_MS);
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new WhisperingError('Error starting recording', error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new WhisperingError('No active media recorder', 'Cannot stop recording'));
        return;
      }

      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(this.recordedChunks, { type: this.mediaRecorder!.mimeType });
        this.resetRecorder();
        resolve(audioBlob);
      });

      this.mediaRecorder.stop();
    });
  }

  cancelRecording(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new WhisperingError('No active media recorder', 'Cannot cancel recording'));
        return;
      }

      this.mediaRecorder.addEventListener('stop', () => {
        this.resetRecorder();
        resolve();
      });

      this.mediaRecorder.stop();
    });
  }

  private resetRecorder(): void {
    this.recordedChunks = [];
    this.mediaRecorder = null;
    this.releaseMediaStream();
  }

  private async getMediaStream(): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
        },
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw new WhisperingError('No available audio input devices', 'Please make sure you have a microphone connected');
    }
  }

  private releaseMediaStream(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }
}

type RecordingState = 'inactive' | 'recording' | 'paused';

export const mediaRecorderService = new MediaRecorderService();