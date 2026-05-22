import { create } from 'zustand';
import type { MediaInfo, FormatOption } from './types';

export type DownloadStage =
  | 'idle'
  | 'probing'
  | 'ready'
  | 'preparing'
  | 'downloading'
  | 'complete'
  | 'error';

interface DownloaderState {
  url: string;
  media: MediaInfo | null;
  selectedFormat: FormatOption | null;
  stage: DownloadStage;
  progress: number;
  error: { code: string; message: string } | null;

  setUrl: (url: string) => void;
  setMedia: (media: MediaInfo | null) => void;
  setSelectedFormat: (f: FormatOption | null) => void;
  setStage: (s: DownloadStage) => void;
  setProgress: (p: number) => void;
  setError: (e: { code: string; message: string } | null) => void;
  reset: () => void;
}

export const useDownloaderStore = create<DownloaderState>((set) => ({
  url: '',
  media: null,
  selectedFormat: null,
  stage: 'idle',
  progress: 0,
  error: null,

  setUrl: (url) => set({ url }),
  setMedia: (media) =>
    set({
      media,
      selectedFormat:
        media?.formats.find((f) => f.formatId === 'best') ?? media?.formats[0] ?? null,
    }),
  setSelectedFormat: (selectedFormat) => set({ selectedFormat }),
  setStage: (stage) => set({ stage }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error, stage: error ? 'error' : 'idle' }),
  reset: () =>
    set({
      url: '',
      media: null,
      selectedFormat: null,
      stage: 'idle',
      progress: 0,
      error: null,
    }),
}));
