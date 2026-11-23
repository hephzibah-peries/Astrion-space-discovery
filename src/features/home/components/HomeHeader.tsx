import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { User } from '../../auth/types/auth.types';

interface HomeHeaderProps {
  user: User | null;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ user }) => {
  return (
    <View style={styles.header}>
      {/* Telemetry Status Banner */}
      <View style={styles.statusRow}>
        <View style={styles.liveDot} />
        <Text style={styles.statusText}>✦ MISSION CONTROL ONLINE</Text>
      </View>

      {/* Brand Title & Tagline */}
      <Text style={styles.brandTitle}>🪐 ASTRION</Text>
      <Text style={styles.tagline}>Explore the Universe, Discover Science.</Text>

      {/* Welcoming Greeting */}
      <View style={styles.greetingBox}>
        <Text style={styles.greetingLabel}>COMMANDER ON DECK</Text>
        <Text style={styles.userName}>
          {user ? `${user.firstName} ${user.lastName}` : 'Cadet Explorer'}
        </Text>
        <Text style={styles.userHandle}>
          @{user?.username || 'explorer'} • {user?.email || 'astrion.space'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  statusText: {
    color: colors.success,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 3,
    marginBottom: 2,
  },
  tagline: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  greetingBox: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  greetingLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
