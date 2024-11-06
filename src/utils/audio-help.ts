
// const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
//   const numChannels = buffer.numberOfChannels;
//   const sampleRate = buffer.sampleRate;
//   const format = 1; // PCM
//   const bitDepth = 16;

//   const bytesPerSample = bitDepth / 8;
//   const blockAlign = numChannels * bytesPerSample;

//   const bufferLength = buffer.length;
//   const byteRate = sampleRate * blockAlign;
//   const dataSize = bufferLength * blockAlign;

//   const headerSize = 44;
//   const totalSize = headerSize + dataSize;

//   const arrayBuffer = new ArrayBuffer(totalSize);
//   const view = new DataView(arrayBuffer);

//   // RIFF identifier
//   writeString(view, 0, 'RIFF');
//   // file length minus RIFF identifier length and file description length
//   view.setUint32(4, 36 + dataSize, true);
//   // RIFF type
//   writeString(view, 8, 'WAVE');
//   // format chunk identifier
//   writeString(view, 12, 'fmt ');
//   // format chunk length
//   view.setUint32(16, 16, true);
//   // sample format (raw)
//   view.setUint16(20, format, true);
//   // channel count
//   view.setUint16(22, numChannels, true);
//   // sample rate
//   view.setUint32(24, sampleRate, true);
//   // byte rate (sample rate * block align)
//   view.setUint32(28, byteRate, true);
//   // block align (channel count * bytes per sample)
//   view.setUint16(32, blockAlign, true);
//   // bits per sample
//   view.setUint16(34, bitDepth, true);
//   // data chunk identifier
//   writeString(view, 36, 'data');
//   // data chunk length
//   view.setUint32(40, dataSize, true);

//   const channels = [];
//   for (let i = 0; i < numChannels; i++) {
//     channels.push(buffer.getChannelData(i));
//   }

//   let offset = 44;
//   for (let i = 0; i < bufferLength; i++) {
//     for (let channel = 0; channel < numChannels; channel++) {
//       const sample = Math.max(-1, Math.min(1, channels[channel][i]));
//       view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
//       offset += 2;
//     }
//   }

//   return arrayBuffer;
// }

// const writeString = (view: DataView, offset: number, string: string) => {
//   for (let i = 0; i < string.length; i++) {
//     view.setUint8(offset + i, string.charCodeAt(i));
//   }
// }

// export const convertToWav = async (blob: Blob): Promise<Blob> => {
//   const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//   const arrayBuffer = await blob.arrayBuffer();
//   const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

//   const wavBuffer = audioBufferToWav(audioBuffer);
//   return new Blob([wavBuffer], { type: 'audio/wav' });
// }








export const convertToWav = async (blob: Blob, targetSampleRate: number): Promise<Blob> => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const arrayBuffer = await blob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Resample audio to target sample rate (16 kHz)
  const offlineContext = new OfflineAudioContext(1, audioBuffer.duration * targetSampleRate, targetSampleRate);
  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineContext.destination);
  source.start(0);
  const resampled = await offlineContext.startRendering();

  const wavBuffer = audioBufferToWav(resampled);
  return new Blob([wavBuffer], { type: 'audio/wav' });
};

const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
  const numChannels = 1; // Force mono
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const bufferLength = buffer.length;
  const byteRate = sampleRate * blockAlign;
  const dataSize = bufferLength * blockAlign;

  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // file length minus RIFF identifier length and file description length
  view.setUint32(4, 36 + dataSize, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw)
  view.setUint16(20, format, true);
  // channel count
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, byteRate, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, blockAlign, true);
  // bits per sample
  view.setUint16(34, bitDepth, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, dataSize, true);

  const channel = buffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < bufferLength; i++) {
    // @ts-ignore
    const sample = Math.max(-1, Math.min(1, channel[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  }

  return arrayBuffer;
};

const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};