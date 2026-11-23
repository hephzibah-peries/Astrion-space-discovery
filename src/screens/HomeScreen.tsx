import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useAuth } from '../features/auth/context/AuthContext';
import { TabScreenProps } from '../navigation/navigation.types';

// Sample discoveries for navigation testing
const SAMPLE_DISCOVERIES = [
  {
    id: 'apod-001',
    title: 'Carina Nebula in Deep Infrared',
    category: 'DEEP SPACE',
    instrument: 'JWST NIRCam',
    description: 'Star-forming region NGC 3324 revealed with unprecedented clarity through cosmic dust cliffs.',
  },
  {
    id: 'apod-002',
    title: 'Europa Clipper: Journey to an Ocean World',
    category: 'PLANETARY MISSION',
    instrument: 'Radiation-Hardened Avionics',
    description: 'NASA flagship expedition investigating the habitability of Jupiter icy moon Europa.',
  },
];

export const HomeScreen: React.FC<TabScreenProps<'Home'>> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Terminate Mission Session',
      'Are you sure you want to sign out of ASTRION? Your secure session will be cleared from Expo SecureStore.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand & Greeting Header */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.statusDot} />
            <Text style={styles.badgeText}>✦ ASTRION MISSION CONTROL</Text>
          </View>
          <Text style={styles.brandTitle}>🪐 ASTRION</Text>
          <Text style={styles.greeting}>
            Welcome back,{' '}
            <Text style={styles.userName}>
              {user ? `${user.firstName} ${user.lastName}` : 'Commander'}
            </Text>
          </Text>
          <Text style={styles.userEmail}>{user?.email || 'authenticated explorer'}</Text>
        </View>

        {/* Discovery Feed Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Celestial Discoveries</Text>
          <Text style={styles.sectionSubtitle}>Tap card to inspect telemetry</Text>
        </View>

        {SAMPLE_DISCOVERIES.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.discoveryCard}
            onPress={() => navigation.navigate('Details', { itemId: item.id })}
            activeOpacity={0.8}
          >
            <View style={styles.cardTopRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <Text style={styles.itemIdTag}>ID: {item.id}</Text>
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardInstrument}>Instrument: {item.instrument}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>

            <View style={styles.cardFooter}>
              <Text style={styles.inspectLink}>Inspect Telemetry Data  →</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Navigation Testing Note */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>🚀 Navigation Architecture Note</Text>
          <Text style={styles.infoDescription}>
            Tapping any discovery card navigates to the typed <Text style={styles.codeText}>Details</Text> screen,
            passing strictly the <Text style={styles.codeText}>itemId</Text> parameter.
          </Text>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Sign Out of Mission Control</Text>
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
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 24,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  badgeText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 3,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  userName: {
    color: colors.primary,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 12,
    color: colors.textMuted,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
  },
  discoveryCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  categoryText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  itemIdTag: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'monospace',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardInstrument: {
    fontSize: 12,
    color: colors.accentPurple,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 10,
  },
  inspectLink: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: 'rgba(129, 140, 248, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.2)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    marginTop: 8,
  },
  infoTitle: {
    color: colors.accentPurple,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  codeText: {
    color: colors.primary,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#F87171',
    fontSize: 14,
    fontWeight: '700',
  },
});
