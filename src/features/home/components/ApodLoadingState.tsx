import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const ApodLoadingState: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.cosmicIcon}>🪐</Text>
        <Text style={styles.loadingTitle}>Scanning Deep Space...</Text>
        <Text style={styles.loadingSubtitle}>
          Establishing connection to NASA planetary archives
        </Text>
      </View>

      <View style={styles.contentPlaceholder}>
        <View style={styles.shimmerTag} />
        <View style={styles.shimmerTitle} />
        <View style={styles.shimmerLineLong} />
        <View style={styles.shimmerLineMedium} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 24,
  },
  imagePlaceholder: {
    height: 240,
    backgroundColor: 'rgba(11, 14, 23, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cosmicIcon: {
    fontSize: 32,
    marginTop: 12,
    marginBottom: 4,
  },
  loadingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  loadingSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
  contentPlaceholder: {
    padding: 18,
    gap: 10,
  },
  shimmerTag: {
    width: 90,
    height: 18,
    borderRadius: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  shimmerTitle: {
    width: '75%',
    height: 22,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  shimmerLineLong: {
    width: '100%',
    height: 14,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  shimmerLineMedium: {
    width: '65%',
    height: 14,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});
