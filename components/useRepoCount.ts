import { create } from 'zustand';

export function useRepoCount() {
  const { count, setCount } = useRepoStore((state) => state);

  return { count, setCount } as const;
}

const useRepoStore = create<{
  count: number;
  setCount: (count: number) => void;
}>((set) => ({
  count: 0,
  setCount: (count) => set(() => ({ count })),
}));
