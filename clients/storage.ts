import AsyncStorage from '@react-native-async-storage/async-storage';

export function useStorage(field: string) {
  return {
    set: async (data: unknown) => {
      const value = JSON.stringify(data);
      await AsyncStorage.setItem(field, value);
    },
    get: async (empty: unknown) => {
      const value = await AsyncStorage.getItem(field);
      if (!value) return empty;
      return JSON.parse(value);
    },
  };
}
