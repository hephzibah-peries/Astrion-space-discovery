import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../features/auth/context/AuthContext';
import { AuthButton } from '../features/auth/components/AuthButton';

export const AuthenticatedHomeScreen: React.FC = () => {
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Mission Status Header */}
        <View style={styles.badgeContainer}>
          <View style={styles.liveDot} />
          <Text style={styles.badgeText}>✦ MISSION PROTOCOL ACTIVE</Text>
        </View>

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user?.image ? (
              <Image source={{ uri: user.image }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarIcon}>🧑‍🚀</Text>
            )}
          </View>
          <Text style={styles.greeting}>Welcome, Explorer</Text>
          <Text style={styles.userName}>
            {user ? `${user.firstName} ${user.lastName}` : 'Cadet'}
          </Text>
          <Text style={styles.userHandle}>@{user?.username || 'cadet'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'explorer@astrion.space'}</Text>
        </View>

        {/* Telemetry / Credentials Overview */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Cosmic Credentials</Text>
          <Text style={styles.sectionSubtitle}>Encrypted via SecureStore</Text>
        </View>

        <View style={styles.telemetryGrid}>
          <View style={styles.telemetryCard}>
            <Text style={styles.telemetryLabel}>USER ID</Text>
            <Text style={styles.telemetryValue}>#{user?.id || 1}</Text>
          </View>
          <View style={styles.telemetryCard}>
            <Text style={styles.telemetryLabel}>SECURITY</Text>
            <Text style={styles.telemetryValueSuccess}>AES Encrypted</Text>
          </View>
          <View style={styles.telemetryCard}>
            <Text style={styles.telemetryLabel}>PROVIDER</Text>
            <Text style={styles.telemetryValue}>DummyJSON Auth</Text>
          </View>
          <View style={styles.telemetryCard}>
            <Text style={styles.telemetryLabel}>STATUS</Text>
            <Text style={styles.telemetryValueSuccess}>Authorized</Text>
          </View>
        </View>

        {/* Mission Roadmap Card */}
        <View style={styles.roadmapCard}>
          <View style={styles.roadmapHeader}>
            <Text style={styles.roadmapIcon}>🛰️</Text>
            <Text style={styles.roadmapTitle}>ASTRION Mission Horizon</Text>
          </View>
          <Text style={styles.roadmapDescription}>
            Authentication (Feature 002) is verified and active. Your secure JWT token is restored
            seamlessly whenever you open the app. Future scientific modules are on standby:
          </Text>

          <View style={styles.statusList}>
            <View style={styles.statusItem}>
              <Text style={styles.statusEmoji}>🪐</Text>
              <Text style={styles.statusItemText}>
                <Text style={styles.statusItemBold}>Solar System Explorer:</Text> Standby for Feature 003
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusEmoji}>🔭</Text>
              <Text style={styles.statusItemText}>
                <Text style={styles.statusItemBold}>NASA APOD Discovery:</Text> Standby for Feature 004
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusEmoji}>🧠</Text>
              <Text style={styles.statusItemText}>
                <Text style={styles.statusItemBold}>Space Science Quizzes:</Text> Standby for Feature 005
              </Text>
            </View>
          </View>
        </View>

        {/* Logout Action */}
        <AuthButton
          title="Disconnect Session (Sign Out)  →"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 40,
    alignItems: 'center',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 20,
  },
  liveDot: {
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
  profileCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarIcon: {
    fontSize: 40,
  },
  greeting: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 14,
    color: colors.accentPurple,
    fontWeight: '600',
    marginBottom: 6,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  sectionHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
  },
  telemetryGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  telemetryCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  telemetryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  telemetryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  telemetryValueSuccess: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
  },
  roadmapCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  roadmapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  roadmapIcon: {
    fontSize: 18,
  },
  roadmapTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  roadmapDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  statusList: {
    gap: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  statusEmoji: {
    fontSize: 16,
  },
  statusItemText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  statusItemBold: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  logoutButton: {
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
});
