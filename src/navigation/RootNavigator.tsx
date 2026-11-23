import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { DarkTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { useAuth } from '../features/auth/context/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { colors } from '../theme/colors';

const AstrionTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.primary,
  },
};

export const RootNavigator: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingEmblem}>🪐</Text>
        <Text style={styles.loadingTitle}>ASTRION</Text>
        <Text style={styles.loadingSubtitle}>Restoring Secure Session from SecureStore...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={AstrionTheme}>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingEmblem: {
    fontSize: 48,
    marginTop: 20,
    marginBottom: 8,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 3,
    marginBottom: 6,
  },
  loadingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
