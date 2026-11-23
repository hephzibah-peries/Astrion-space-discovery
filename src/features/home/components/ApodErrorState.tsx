import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../../theme/colors';

interface ApodErrorStateProps {
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export const ApodErrorState: React.FC<ApodErrorStateProps> = ({
  message,
  onRetry,
  isRetrying = false,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Text style={styles.errorIcon}>📡</Text>
      </View>

      <Text style={styles.title}>Telemetry Signal Lost</Text>
      <Text style={styles.message}>{message}</Text>

      <View style={styles.hintBox}>
        <Text style={styles.hintIcon}>💡</Text>
        <Text style={styles.hintText}>
          NASA APOD requires internet connectivity. If rate limits are reached on the default key,
          configure <Text style={styles.codeText}>EXPO_PUBLIC_NASA_API_KEY</Text> in your local environment.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.retryButton}
        onPress={onRetry}
        disabled={isRetrying}
        activeOpacity={0.8}
      >
        {isRetrying ? (
          <ActivityIndicator size="small" color={colors.background} />
        ) : (
          <Text style={styles.retryText}>Re-establish Connection  ↺</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.errorBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  errorIcon: {
    fontSize: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    color: '#FCA5A5',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  hintBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
    marginBottom: 18,
  },
  hintIcon: {
    fontSize: 14,
  },
  hintText: {
    flex: 1,
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  codeText: {
    color: colors.primary,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  retryButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
