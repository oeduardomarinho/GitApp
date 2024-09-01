import { Octicons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { Platform, Pressable } from 'react-native';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import { useRepoCount } from '@/components/useRepoCount';
import Colors from '@/constants/Colors';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(
  props: Readonly<{
    name: React.ComponentProps<typeof Octicons>['name'];
    color: string;
  }>
) {
  return <Octicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { count } = useRepoCount();

  const TabTwoStyle: Parameters<typeof Tabs.Screen>[0]['options'] = count
    ? {
        tabBarBadge: count < 99 ? count : '+99',
        tabBarBadgeStyle: {
          maxWidth: 40,
        },
        ...(Platform.OS === 'web' && {
          tabBarIconStyle: {
            marginRight: count > 99 ? 20 : 10,
          },
        }),
      }
    : {};

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name='book' color={color} />,
          headerRight: () => (
            <Link href='/modal' asChild>
              <Pressable>
                {({ pressed }) => (
                  <Octicons
                    name='search'
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name='two'
        options={{
          title: 'Repositórios',
          tabBarIcon: ({ color }) => <TabBarIcon name='repo' color={color} />,
          ...TabTwoStyle,
        }}
      />
    </Tabs>
  );
}
