import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { ComponentProps, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  Card,
  Divider,
  TouchableRipple,
} from 'react-native-paper';

import { Text, useThemeColor, View } from '@/components/Themed';
import { useRepoCount } from '@/components/useRepoCount';
import { useSnackbar } from '@/components/useSnackbar';
import { useUsername } from '@/components/useUsername';
import { getRepos } from '@/services';

export default function TabTwoScreen() {
  const { username } = useUsername();
  const { count } = useRepoCount();
  const [Snackbar, showSnackbar] = useSnackbar(3000);

  const [repos, setRepos] = useState<Repository[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPage(1);

    return () => {
      setRepos([]);
      setPage(0);
    };
  }, [username]);

  useEffect(() => {
    if (count === 0) showSnackbar();
  }, [count]);

  const fetchPage = async (page: number) => {
    if (loading || repos.length === count) return;

    setLoading(true);
    const data = await getRepos(username, page)
      .then(async (response) => {
        if (response?.data) {
          return response.data;
        } else {
          console.log('No repo found in response');
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));

    if (!data) return;

    setRepos((existingItems) => {
      return [...existingItems, ...data];
    });
    setPage(page);
    setLoading(false);
  };

  return (
    <View style={styles.container} key={count}>
      <FlatList
        onEndReachedThreshold={5}
        onEndReached={() => fetchPage(page + 1)}
        data={repos}
        renderItem={({ item }) => <Item {...item} />}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={<ActivityIndicator animating={loading} />}
        style={{ marginHorizontal: 10 }}
        ItemSeparatorComponent={Divider}
      />
      <Snackbar />
    </View>
  );
}

const Item = ({
  html_url: link,
  language,
  name,
  description,
  created_at,
  pushed_at,
}: Repository) => {
  const tintColor = useThemeColor({}, 'tint');

  return (
    <TouchableRipple onPress={() => Linking.openURL(link)}>
      <Card elevation={0}>
        <Card.Title
          title={<Text>{name}</Text>}
          left={(props) => (
            <MaterialCommunityIcons
              name={languageMap(language)}
              {...props}
              color={tintColor}
            />
          )}
        />
        {description && (
          <Card.Content>
            <Text variant='bodyMedium'>{description}</Text>
          </Card.Content>
        )}
        <Card.Actions
          style={{
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <Text>
            {[
              'Criado em',
              new Intl.DateTimeFormat('pt-BR').format(new Date(created_at)),
            ].join(' ')}
          </Text>
          <Text>
            {[
              'Último push em',
              new Intl.DateTimeFormat('pt-BR').format(new Date(pushed_at)),
            ].join(' ')}
          </Text>
        </Card.Actions>
      </Card>
    </TouchableRipple>
  );

  function languageMap(
    language: string | null
  ): ComponentProps<typeof MaterialCommunityIcons>['name'] {
    if (!language) language = '';
    language = language.toLowerCase();

    if (language === 'css') language = 'css3';
    if (language === 'c#') language = 'csharp';
    if (language === 'c++') language = 'cpp';
    if (language === 'html') language = 'html5';

    if (!(`language-${language}` in MaterialCommunityIcons.getRawGlyphMap()))
      return 'help-rhombus';

    return `language-${language}` as ComponentProps<
      typeof MaterialCommunityIcons
    >['name'];
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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

type Repository = {
  id: number;
  name: string;
  html_url: string;
  language: string | null;
  description: string | null;
  created_at: string;
  pushed_at: string;
};
