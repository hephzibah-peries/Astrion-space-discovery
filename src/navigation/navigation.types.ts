import type { NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

/**
 * Authentication Stack: for unauthenticated explorers.
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

/**
 * Bottom Tab Navigator: main sections for authenticated explorers.
 */
export type TabParamList = {
  Home: undefined;
  Favourites: undefined;
};

/**
 * Main Application Stack: wraps bottom tabs and deep modal/details screens.
 */
export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  Details: { itemId: string };
};

/**
 * Screen Props helper types for strong compile-time type safety.
 */
export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList, T>,
    NativeStackScreenProps<MainStackParamList>
  >;

/**
 * Global React Navigation type augmentation for useNavigation() hook autocompletion.
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainStackParamList, AuthStackParamList {}
  }
}
