import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ApodItem } from '../types/apod.types';
import { colors } from '../../../theme/colors';

interface DiscoverSpaceSectionProps {
  currentApod: ApodItem | null;
  onExploreApod: (itemId: string) => void;
}

export const DiscoverSpaceSection: React.FC<DiscoverSpaceSectionProps> = ({
  currentApod,
  onExploreApod,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Discover Space</Text>
        <Text style={styles.sectionSubtitle}>Genuine NASA Telemetry Insights</Text>
      </View>

      {/* Real APOD Telemetry Cards */}
      {currentApod && (
        <View style={styles.telemetryGrid}>
          <View style={styles.telemetryCard}>
            <Text style={styles.cardIcon}>📡</Text>
            <Text style={styles.cardLabel}>DATA SOURCE</Text>
            <Text style={styles.cardValue}>NASA Planetary API</Text>
            <Text style={styles.cardDetail}>Version {currentApod.service_version || 'v1'}</Text>
          </View>

          <View style={styles.telemetryCard}>
            <Text style={styles.cardIcon}>🛰️</Text>
            <Text style={styles.cardLabel}>OBSERVATION DATE</Text>
            <Text style={styles.cardValue}>{currentApod.date}</Text>
            <Text style={styles.cardDetail}>Earth Standard Time</Text>
          </View>

          <View style={styles.telemetryCard}>
            <Text style={styles.cardIcon}>
              {currentApod.media_type === 'video' ? '🎬' : '🔭'}
            </Text>
            <Text style={styles.cardLabel}>MEDIA SPECTRUM</Text>
            <Text style={styles.cardValue}>
              {currentApod.media_type === 'video' ? 'Video Stream' : 'High-Res Optical'}
            </Text>
            <Text style={styles.cardDetail}>
              {currentApod.hdurl ? 'HD Master Available' : 'Standard Broadcast'}
            </Text>
          </View>

          <View style={styles.telemetryCard}>
            <Text style={styles.cardIcon}>🏛️</Text>
            <Text style={styles.cardLabel}>
              {currentApod.copyright ? 'COPYRIGHT / CREDIT' : 'IMAGE CREDIT'}
            </Text>
            <Text style={styles.cardValue}>
              {currentApod.copyright || 'Public Domain (NASA)'}
            </Text>
            <Text style={styles.cardDetail}>
              {currentApod.copyright ? 'Protected Attribution' : 'No Copyright Listed'}
            </Text>
          </View>
        </View>
      )}

      {/* Astronomy Guide / Telemetry Quick Card */}
      <View style={styles.guideCard}>
        <View style={styles.guideHeader}>
          <Text style={styles.guideIcon}>🌌</Text>
          <Text style={styles.guideTitle}>About NASA APOD</Text>
        </View>
        <Text style={styles.guideDescription}>
          Each day, NASA features a different image or photograph of our universe, accompanied by a
          scientific explanation written by professional astrophysicists.
        </Text>
        {currentApod && (
          <TouchableOpacity
            style={styles.guideAction}
            onPress={() => onExploreApod(currentApod.date)}
            activeOpacity={0.8}
          >
            <Text style={styles.guideActionText}>
              Open Telemetry Dossier ({currentApod.date})  →
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  telemetryCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  cardDetail: {
    fontSize: 11,
    color: colors.textMuted,
  },
  guideCard: {
    backgroundColor: 'rgba(129, 140, 248, 0.08)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.25)',
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  guideIcon: {
    fontSize: 18,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accentPurple,
  },
  guideDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  guideAction: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(129, 140, 248, 0.2)',
    paddingTop: 10,
  },
  guideActionText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
});
