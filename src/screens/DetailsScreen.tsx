import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { MainStackScreenProps } from '../navigation/navigation.types';
import { apodCache } from '../features/home/services/apodCache';

// Legacy mock catalog for backward compatibility with Feature 003 sample IDs
const LEGACY_CATALOG: Record<
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
  const [imageLoading, setImageLoading] = useState(true);

  // Check if item is available in APOD cache (from Home screen)
  const cachedApod = apodCache.get(itemId);
  const legacyContent = LEGACY_CATALOG[itemId];

  const isRealApod = !!cachedApod;
  const isVideo = cachedApod?.media_type === 'video';
  const displayImageUri = isVideo ? cachedApod?.thumbnail_url : cachedApod?.hdurl || cachedApod?.url;

  const handleOpenExternal = async () => {
    if (!cachedApod) return;
    try {
      const urlToOpen = cachedApod.hdurl || cachedApod.url;
      const canOpen = await Linking.canOpenURL(urlToOpen);
      if (canOpen) {
        await Linking.openURL(urlToOpen);
      }
    } catch {
      // Graceful fallback
    }
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
          <Text style={styles.heroIcon}>{isRealApod ? '🔭' : '🪐'}</Text>
          <Text style={styles.title}>
            {cachedApod?.title || legacyContent?.title || `Celestial Item ${itemId}`}
          </Text>
          <Text style={styles.mission}>
            {isRealApod
              ? `NASA Planetary APOD Archive • ${cachedApod?.date}`
              : legacyContent?.mission || 'General Astrophysical Archive'}
          </Text>
          {cachedApod?.copyright && (
            <Text style={styles.copyrightText}>Attribution: © {cachedApod.copyright}</Text>
          )}
        </View>

        {/* Visual Media Presentation (When APOD has image or video) */}
        {isRealApod && displayImageUri && (
          <View style={styles.mediaContainer}>
            <Image
              source={{ uri: displayImageUri }}
              style={styles.mediaImage}
              resizeMode="cover"
              onLoadEnd={() => setImageLoading(false)}
            />
            {imageLoading && (
              <View style={styles.mediaLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}

            {isVideo && (
              <TouchableOpacity
                style={styles.videoBadge}
                onPress={handleOpenExternal}
                activeOpacity={0.8}
              >
                <Text style={styles.videoBadgeText}>▶ Launch Video Transmission</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Telemetry Data Grid */}
        <View style={styles.telemetryGrid}>
          <View style={styles.gridCell}>
            <Text style={styles.gridLabel}>DATA SOURCE</Text>
            <Text style={styles.gridValue}>
              {isRealApod ? 'NASA APOD API' : legacyContent?.target || 'NASA Catalog'}
            </Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.gridLabel}>SPECTRUM / FORMAT</Text>
            <Text style={styles.gridValue}>
              {isRealApod
                ? cachedApod?.media_type === 'video'
                  ? 'Video Broadcast'
                  : 'Optical / IR'
                : legacyContent?.distance || 'Calibrated'}
            </Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.gridLabel}>PARAM HANDSHAKE</Text>
            <Text style={styles.gridValueSuccess}>PASS (itemId: {itemId})</Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.gridLabel}>RESOLUTION</Text>
            <Text style={styles.gridValue}>
              {cachedApod?.hdurl ? 'HD Master Available' : 'Standard Broadcast'}
            </Text>
          </View>
        </View>

        {/* Detailed Scientific Explanation */}
        <View style={styles.contentCard}>
          <Text style={styles.contentHeader}>Scientific Overview & Telemetry</Text>
          <Text style={styles.contentBody}>
            {cachedApod?.explanation ||
              legacyContent?.description ||
              'Sample telemetry loaded for navigation parameter verification.'}
          </Text>
        </View>

        {/* External High-Resolution Link Button */}
        {isRealApod && (cachedApod.hdurl || cachedApod.url) && (
          <TouchableOpacity
            style={styles.externalButton}
            onPress={handleOpenExternal}
            activeOpacity={0.8}
          >
            <Text style={styles.externalButtonText}>
              {isVideo ? 'Open Video Stream Link  ↗' : 'View High-Resolution Image on NASA  ↗'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Return Button */}
        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.returnButtonText}>Return to Discoveries Feed</Text>
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
    lineHeight: 28,
  },
  mission: {
    fontSize: 13,
    color: colors.accentPurple,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  mediaContainer: {
    width: '100%',
    height: 240,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#07090F',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaLoader: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11, 14, 23, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(11, 14, 23, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  videoBadgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
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
    lineHeight: 21,
  },
  externalButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  externalButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
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
