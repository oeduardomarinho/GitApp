/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { MaterialCommunityIcons as DefaultMaterialCommunityIcons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { View as DefaultView } from 'react-native';
import {
  Searchbar as DefaultSearchbar,
  Text as DefaultText,
} from 'react-native-paper';

import Colors from '@/constants/Colors';

import { useColorScheme } from './useColorScheme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & ComponentProps<typeof DefaultText>;
export type ViewProps = ThemeProps & DefaultView['props'];
export type SearchbarProps = ThemeProps &
  ComponentProps<typeof DefaultSearchbar>;
export type MaterialCommunityIconsProps = ThemeProps &
  ComponentProps<typeof DefaultMaterialCommunityIcons>;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Searchbar(props: SearchbarProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );
  const tintColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'tint'
  );

  return (
    <DefaultSearchbar
      style={[{ backgroundColor }, style]}
      iconColor={tintColor}
      elevation={1}
      {...otherProps}
    />
  );
}
