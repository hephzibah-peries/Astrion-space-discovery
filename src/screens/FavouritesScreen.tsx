import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { TabScreenProps } from '../navigation/navigation.types';

export const FavouritesScreen: React.FC<TabScreenProps<'Favourites'>> = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.badgeText}>✦ ARCHIVE REPOSITORY</Text>
          <Text style={styles.title}>Cosmic Favourites</Text>
          <Text style={styles.subtitle}>Saved astronomical images, planetary telemetry, and science articles</Text>
        </View>

        {/* Empty State Presentation */}
        <View style={styles.emptyCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.emptyIcon}>🔭</Text>
          </View>
          <Text style={styles.emptyTitle}>No Cosmic Favourites Yet</Text>
          <Text style={styles.emptyDescription}>
            As you explore galaxies, planetary rovers, and deep space telemetry, tap the star icon to bookmark them into this personal mission archive.
          </Text>

          <View style={styles.roadmapTag}>
            <Text style={styles.roadmapTagText}>Feature 006 Roadmap: Offline Storage & Favourites Persistence</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 32,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  roadmapTag: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(129, 140, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.25)',
  },
  roadmapTagText: {
    fontSize: 11,
    color: colors.accentPurple,
    fontWeight: '600',
    textAlign: 'center',
  },
});
