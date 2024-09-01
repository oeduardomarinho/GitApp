import { create } from 'zustand';

export function useUsername() {
  const { username, setUsername } = store((state) => state);

  return { username, setUsername } as const;
}

const store = create<{
  username: string;
  setUsername: (username: string) => void;
}>((set) => ({
  username: 'oeduardomarinho',
  setUsername: (username) =>
    set(() => ({ username: username.toLowerCase().trim() })),
}));
