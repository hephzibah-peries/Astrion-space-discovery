import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [isExplored, setIsExplored] = useState(false);

  const handleGetStarted = () => {
    setIsExplored(true);
    Alert.alert(
      'Mission Initiated 🚀',
      'Welcome to ASTRION! Your cosmic exploration environment is ready.',
      [{ text: 'Explore Systems', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Cosmic Ambient Halo / Decorative Element */}
        <View style={styles.glowOrb} />

        {/* Header Category Tag */}
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>✦ SPACE & SCIENCE DISCOVERY</Text>
        </View>

        {/* App Title and Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.iconEmblem}>🪐</Text>
          <Text style={styles.brandTitle}>ASTRION</Text>
          <Text style={styles.tagline}>Explore the Universe, Discover Science.</Text>
        </View>

        {/* Introduction Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>About the Mission</Text>
          <Text style={styles.cardDescription}>
            ASTRION is your interactive portal to the cosmos. Designed for curious minds,
            it unites real-time astrophysics, planetary discoveries, and groundbreaking
            scientific research into an accessible mobile experience.
          </Text>

          {/* Quick Pillar Highlights */}
          <View style={styles.pillRow}>
            <View style={styles.featurePill}>
              <Text style={styles.featurePillText}>🔭 Deep Space</Text>
            </View>
            <View style={styles.featurePill}>
              <Text style={styles.featurePillText}>🌌 Astrophysics</Text>
            </View>
            <View style={styles.featurePill}>
              <Text style={styles.featurePillText}>🚀 Missions</Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.primaryButton, isExplored && styles.primaryButtonActive]}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>
            {isExplored ? '✓ Explorer Protocol Active' : 'Get Started  →'}
          </Text>
        </TouchableOpacity>

        {/* Environment Status Badge */}
        <View style={styles.statusFooter}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Expo SDK 58 • TypeScript • Ready</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0E17',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOrb: {
    position: 'absolute',
    top: 40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    transform: [{ scaleX: 1.5 }],
  },
  badgeContainer: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    marginBottom: 20,
  },
  badgeText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconEmblem: {
    fontSize: 54,
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '500',
    color: '#94A3B8',
    textAlign: 'center',
    letterSpacing: 0.5,
    maxWidth: 280,
  },
  card: {
    width: '100%',
    backgroundColor: '#151926',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardDescription: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 18,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featurePill: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
  },
  featurePillText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#38BDF8',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 28,
  },
  primaryButtonActive: {
    backgroundColor: '#0EA5E9',
  },
  primaryButtonText: {
    color: '#0B0E17',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  statusText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
  },
});
