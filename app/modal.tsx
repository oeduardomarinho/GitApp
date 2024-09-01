import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { Avatar, List, TouchableRipple } from 'react-native-paper';

import { useStorage } from '@/clients/storage';
import { Searchbar, Text, View } from '@/components/Themed';
import { useSnackbar } from '@/components/useSnackbar';
import { useUsername } from '@/components/useUsername';
import { getUser } from '@/services';

export default function ModalScreen() {
  const [Snackbar, showSnackbar] = useSnackbar(1500);

  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<Partial<User>[]>([]);
  const [user, setUser] = useState<Partial<User>>({});

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder='Pesquise'
        onChangeText={(value) => setSearchQuery(value)}
        onSubmitEditing={async () => {
          const user = await getUser(searchQuery)
            .then((response) => {
              if (response?.data) {
                return {
                  name: response.data.name,
                  location: response.data.location,
                  uri: response.data.avatar_url,
                  username: response.data.login,
                };
              } else {
                console.log('No user found in response');
              }
            })
            .catch((error) => {
              console.log(error);
            });

          if (!user) return showSnackbar();

          setUser(user);
          setHistory([
            user,
            ...history.filter((v) => v.username != user.username),
          ]);
        }}
        value={searchQuery}
        style={{
          marginVertical: 10,
          minWidth: '80%',
        }}
      />
      {Object.keys(user).length > 0 && <Item key={user.username} {...user} />}
      <HistoryList history={history} setHistory={setHistory} />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <Snackbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

const HistoryList = ({
  history,
  setHistory,
}: {
  history: Partial<User>[];
  setHistory: (history: Partial<User>[]) => void;
}) => {
  const storage = useStorage('history');

  const fillInitialHistory = useCallback(async () => {
    const history = await storage.get([]);
    setHistory(history);
  }, [setHistory]);

  const saveHistory = useCallback(async () => {
    await storage.set(history);
  }, [history]);

  useEffect(() => {
    fillInitialHistory();
  }, []);

  useEffect(() => {
    return () => {
      saveHistory();
    };
  }, [history]);

  return (
    <ScrollView>
      {history.length > 0 && (
        <List.Section>
          <List.Subheader>
            <Text>Histórico de pesquisa</Text>
          </List.Subheader>
          {history.map((user) => (
            <Item key={user.username} {...user} />
          ))}
        </List.Section>
      )}
    </ScrollView>
  );
};

const Item = (user: Partial<User>) => {
  const { setUsername } = useUsername();

  return (
    <TouchableRipple
      key={user.username}
      onPress={async () => {
        setUsername(user.username!);
        router.navigate({ pathname: '/(tabs)' });
      }}
    >
      <List.Item
        titleNumberOfLines={3}
        title={
          <View>
            <Text variant='bodyLarge'>{user.name}</Text>
            {Boolean(user.location) && (
              <Text variant='bodyMedium'>{user.location}</Text>
            )}
            <Text variant='bodyMedium'>@{user.username}</Text>
          </View>
        }
        left={(props) => <Avatar.Image {...props} source={{ uri: user.uri }} />}
      />
    </TouchableRipple>
  );
};

type User = {
  name: string;
  location: string;
  uri: string;
  username: string;
  followers: number;
};
