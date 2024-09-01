import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';

import { Text, useThemeColor, View } from '@/components/Themed';
import { useRepoCount } from '@/components/useRepoCount';
import { useUsername } from '@/components/useUsername';
import { getUser } from '@/services';

export default function TabOneScreen() {
  const { username } = useUsername();
  const { setCount } = useRepoCount();
  const tintColor = useThemeColor({}, 'tint');

  const [user, setUser] = useState<User>({
    name: 'Eduardo Marinho Mascarenhas',
    location: 'Belo Jardim - PE',
    uri: 'https://reactnative.dev/img/tiny_logo.png',
    username,
    followers: 1,
  });

  const handleChangeUsername = useCallback(async () => {
    if (!username) return;

    const { count, user } = (await getUser(username)
      .then((response) => {
        if (response?.data) {
          return {
            user: {
              ...response.data,
              uri: response.data.avatar_url,
            },
            count: response.data.public_repos,
          };
        } else {
          console.log('No user found in response');
        }
      })
      .catch((error) => {
        console.log(error);
      })) || { count: 0 };

    if (!user) return;

    setUser(user);
    setCount(count);
  }, [username]);

  useEffect(() => {
    handleChangeUsername();
  }, [username]);

  return (
    <View style={styles.container}>
      <Avatar.Image size={150} source={{ uri: user.uri }} />
      <View
        style={{
          marginVertical: 10,
          alignItems: 'center',
          rowGap: 3,
        }}
      >
        <Text>{user.name}</Text>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            columnGap: 5,
          }}
        >
          {Boolean(user.location) && (
            <>
              <Text>{user.location}</Text>
              <MaterialCommunityIcons name='circle-small' color={tintColor} />
            </>
          )}
          <Text>@{username}</Text>
        </View>
        <Text>
          {[
            new Intl.NumberFormat('pt-BR').format(user.followers),
            'seguidor'.concat(user.followers !== 1 ? 'es' : ''),
          ].join(' ')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
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

type User = {
  name: string;
  location: string;
  uri: string;
  username: string;
  followers: number;
};
