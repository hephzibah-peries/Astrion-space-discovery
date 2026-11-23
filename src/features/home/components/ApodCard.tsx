import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { ApodItem } from '../types/apod.types';
import { colors } from '../../../theme/colors';

interface ApodCardProps {
  item: ApodItem;
  onViewDetails: (itemId: string) => void;
}

export const ApodCard: React.FC<ApodCardProps> = ({ item, onViewDetails }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const isVideo = item.media_type === 'video';
  const displayImageUri = isVideo ? item.thumbnail_url : item.url;

  const handleOpenVideo = async () => {
    try {
      const canOpen = await Linking.canOpenURL(item.url);
      if (canOpen) {
        await Linking.openURL(item.url);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <View style={styles.card}>
      {/* Media Container: Image or Video */}
      <View style={styles.mediaContainer}>
        {isVideo && !displayImageUri ? (
          <View style={styles.videoFallbackContainer}>
            <Text style={styles.videoIcon}>🎬</Text>
            <Text style={styles.videoTitle}>NASA Multimedia Transmission</Text>
            <Text style={styles.videoSubtitle}>
              Today's celestial feature is an interactive video broadcast.
            </Text>
            <TouchableOpacity
              style={styles.watchButton}
              onPress={handleOpenVideo}
              activeOpacity={0.8}
            >
              <Text style={styles.watchButtonText}>Watch Transmission  ▶</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imageWrapper}>
            {displayImageUri && !imageError ? (
              <Image
                source={{ uri: displayImageUri }}
                style={styles.image}
                resizeMode="cover"
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
              />
            ) : (
              <View style={styles.imageFallback}>
                <Text style={styles.fallbackIcon}>🪐</Text>
                <Text style={styles.fallbackText}>Image Preview Unavailable</Text>
              </View>
            )}

            {imageLoading && (
              <View style={styles.imageLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}

            {isVideo && (
              <TouchableOpacity
                style={styles.videoOverlayBadge}
                onPress={handleOpenVideo}
                activeOpacity={0.8}
              >
                <Text style={styles.videoOverlayText}>▶ Play Video</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Date & Type Badges */}
        <View style={styles.badgeRow}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {isVideo ? '🎬 VIDEO BROADCAST' : '🔭 FEATURED APOD'}
            </Text>
          </View>
          <Text style={styles.dateBadge}>{item.date}</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>

        {item.copyright ? (
          <Text style={styles.copyright}>© {item.copyright}</Text>
        ) : (
          <Text style={styles.copyright}>Public Domain • NASA</Text>
        )}

        <Text style={styles.explanation} numberOfLines={4}>
          {item.explanation}
        </Text>

        {/* Action Button: Details Navigation */}
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => onViewDetails(item.date)}
          activeOpacity={0.8}
        >
          <Text style={styles.detailsButtonText}>
            Inspect Full Scientific Telemetry  →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  mediaContainer: {
    position: 'relative',
    backgroundColor: '#07090F',
  },
  imageWrapper: {
    width: '100%',
    height: 240,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageLoader: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11, 14, 23, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  fallbackIcon: {
    fontSize: 40,
    marginBottom: 6,
  },
  fallbackText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  videoFallbackContainer: {
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D111D',
  },
  videoIcon: {
    fontSize: 44,
    marginBottom: 8,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  videoSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
  },
  watchButton: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  watchButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  videoOverlayBadge: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    backgroundColor: 'rgba(11, 14, 23, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  videoOverlayText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  badgeRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    backgroundColor: 'rgba(11, 14, 23, 0.85)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  typeBadgeText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  dateBadge: {
    backgroundColor: 'rgba(11, 14, 23, 0.85)',
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
    lineHeight: 26,
  },
  copyright: {
    fontSize: 12,
    color: colors.accentPurple,
    fontWeight: '600',
    marginBottom: 10,
  },
  explanation: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 18,
  },
  detailsButton: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 14,
    alignItems: 'flex-start',
  },
  detailsButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
