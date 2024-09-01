import { useEffect, useState } from 'react';
import { Snackbar } from 'react-native-paper';

export function useSnackbar(timeout: number) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => visible && setVisible(false), timeout);
  }, [visible]);

  return [
    () => (
      <Snackbar visible={visible} onDismiss={() => {}}>
        Nenhum resultado foi encontrado.
      </Snackbar>
    ),
    () => setVisible(true),
  ] as const;
}
