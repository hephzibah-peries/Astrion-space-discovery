import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { MainStackScreenProps } from '../navigation/navigation.types';

// Mock astronomical catalog database for navigation demo
const ASTRONOMY_CATALOG: Record<
  string,
  {
    title: string;
    mission: string;
    target: string;
    distance: string;
    description: string;
    telemetryStatus: string;
  }
> = {
  'apod-001': {
    title: 'Carina Nebula Cosmic Cliffs',
    mission: 'James Webb Space Telescope (JWST)',
    target: 'NGC 3324',
    distance: '7,600 light-years',
    description:
      'Captured in infrared light by NIRCam, these towering peaks of dust and gas reveal previously invisible areas of star birth. Intense ultraviolet radiation and stellar winds from massive stars have sculpted these cavernous ridges.',
    telemetryStatus: 'Calibrated • Level 2 Data',
  },
  'apod-002': {
    title: 'Europa Clipper Jovian Trajectory',
    mission: 'NASA Europa Clipper Expedition',
    target: 'Jupiter Moon Europa',
    distance: '628.3 million km from Earth',
    description:
      'Investigating whether the subsurface ocean of Europa could sustain life. The spacecraft carries ice-penetrating radar, surface dust analyzers, and advanced magnetometers to study the icy crust and hydrothermal activity.',
    telemetryStatus: 'Cruise Phase • Nominal Telemetry',
  },
};

export const DetailsScreen: React.FC<MainStackScreenProps<'Details'>> = ({
  route,
  navigation,
}) => {
  const { itemId } = route.params;
  const content = ASTRONOMY_CATALOG[itemId] || {
    title: `Celestial Item ${itemId}`,
    mission: 'General Astrophysical Archive',
    target: 'Uncharted Coordinates',
    distance: 'Unknown',
    description:
      'Temporary sample content loaded for navigation parameter verification. Live NASA APOD and rover APIs will be attached during Feature 004.',
    telemetryStatus: 'Active Parameter Handshake',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Back Navigation Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonIcon}>←</Text>
            <Text style={styles.backButtonText}>Back to Discoveries</Text>
          </TouchableOpacity>
        </View>

        {/* Telemetry ID Badge */}
        <View style={styles.idBadge}>
          <Text style={styles.idBadgeText}>✦ ROUTE PARAMETER: {itemId}</Text>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>🪐</Text>
          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.mission}>{content.mission}</Text>
        </View>

        {/* Telemetry Data Grid */}
        <View style={styles.telemetryGrid}>
          <View style={styles.gridCell}>
            <Text style={styles.gridLabel}>TARGET OBJECT</Text>
            <Text style={styles.gridValue}>{content.target}</Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.gridLabel}>DISTANCE</Text>
            <Text style={styles.gridValue}>{content.distance}</Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.gridLabel}>PARAM HANDSHAKE</Text>
            <Text style={styles.gridValueSuccess}>PASS (itemId: {itemId})</Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.gridLabel}>STATUS</Text>
            <Text style={styles.gridValue}>{content.telemetryStatus}</Text>
          </View>
        </View>

        {/* Detailed Description */}
        <View style={styles.contentCard}>
          <Text style={styles.contentHeader}>Scientific Overview</Text>
          <Text style={styles.contentBody}>{content.description}</Text>
        </View>

        {/* Feature Notice */}
        <View style={styles.noticeBox}>
          <Text style={styles.noticeIcon}>ℹ️</Text>
          <Text style={styles.noticeText}>
            <Text style={styles.noticeBold}>Feature 004 Horizon:</Text> This screen demonstrates typed parameter navigation. In Feature 004, real NASA Astronomy Picture of the Day (APOD) APIs and high-resolution imagery will be connected.
          </Text>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.returnButtonText}>Return to Feed</Text>
        </TouchableOpacity>
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
    paddingTop: 12,
    paddingBottom: 36,
  },
  topBar: {
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButtonIcon: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  idBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    marginBottom: 16,
  },
  idBadgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: 18,
  },
  heroIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  mission: {
    fontSize: 13,
    color: colors.accentPurple,
    fontWeight: '600',
    textAlign: 'center',
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  gridCell: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  gridValueSuccess: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  contentCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },
  contentHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  contentBody: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  noticeBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(129, 140, 248, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.2)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 20,
  },
  noticeIcon: {
    fontSize: 16,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#C7D2FE',
    lineHeight: 17,
  },
  noticeBold: {
    fontWeight: '700',
    color: colors.primary,
  },
  returnButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  returnButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
