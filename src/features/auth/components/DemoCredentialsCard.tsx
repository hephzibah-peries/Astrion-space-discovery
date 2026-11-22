import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

interface DemoCredentialsCardProps {
  onApplyCredentials: (identifier: string, password: string) => void;
}

export const DemoCredentialsCard: React.FC<DemoCredentialsCardProps> = ({
  onApplyCredentials,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.cardIcon}>🚀</Text>
        <Text style={styles.cardTitle}>DummyJSON Demo Credentials</Text>
      </View>
      <Text style={styles.cardDescription}>
        Use official DummyJSON testing credentials to test authenticated state:
      </Text>

      <View style={styles.credsBox}>
        <View style={styles.credRow}>
          <Text style={styles.credLabel}>Username:</Text>
          <Text style={styles.credValue}>emilys</Text>
        </View>
        <View style={styles.credRow}>
          <Text style={styles.credLabel}>Email:</Text>
          <Text style={styles.credValue}>emily.johnson@x.dummyjson.com</Text>
        </View>
        <View style={styles.credRow}>
          <Text style={styles.credLabel}>Password:</Text>
          <Text style={styles.credValue}>emilyspass</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.quickFillButton}
        onPress={() => onApplyCredentials('emilys', 'emilyspass')}
        activeOpacity={0.7}
      >
        <Text style={styles.quickFillText}>⚡ Quick Fill Demo Credentials</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    marginTop: 20,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  cardIcon: {
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.3,
  },
  cardDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 10,
    lineHeight: 16,
  },
  credsBox: {
    backgroundColor: 'rgba(11, 14, 23, 0.7)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  credRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  credLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'monospace',
  },
  credValue: {
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  quickFillButton: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  quickFillText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});
