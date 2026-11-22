import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/features/auth/context/AuthContext';
import { LoginScreen } from './src/features/auth/screens/LoginScreen';
import { RegisterScreen } from './src/features/auth/screens/RegisterScreen';
import { AuthenticatedHomeScreen } from './src/screens/AuthenticatedHomeScreen';
import { colors } from './src/theme/colors';

const MainNavigator: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');

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

  if (isAuthenticated) {
    return <AuthenticatedHomeScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {authScreen === 'login' ? (
        <LoginScreen onNavigateToRegister={() => setAuthScreen('register')} />
      ) : (
        <RegisterScreen onNavigateToLogin={() => setAuthScreen('login')} />
      )}
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <MainNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
