import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { AuthHeader } from '../components/AuthHeader';
import { AuthInput } from '../components/AuthInput';
import { AuthButton } from '../components/AuthButton';
import { useAuth } from '../context/AuthContext';
import {
  validateFullName,
  validateRegistrationEmail,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validation';
import { SimulatedRegisterResponse } from '../types/auth.types';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigateToLogin,
}) => {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [simulatedSuccess, setSimulatedSuccess] = useState<SimulatedRegisterResponse | null>(null);

  const handleRegister = async () => {
    setApiError(null);
    setSimulatedSuccess(null);

    // Validate fields
    const nameVal = validateFullName(fullName);
    const emailVal = validateRegistrationEmail(email);
    const passVal = validatePassword(password);
    const confirmVal = validateConfirmPassword(password, confirmPassword);

    if (!nameVal.isValid || !emailVal.isValid || !passVal.isValid || !confirmVal.isValid) {
      setErrors({
        fullName: nameVal.error,
        email: emailVal.error,
        password: passVal.error,
        confirmPassword: confirmVal.error,
      });
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      fullName,
      email,
      password,
      confirmPassword,
    });
    setIsSubmitting(false);

    if (result.success && result.data) {
      setSimulatedSuccess(result.data);
    } else {
      setApiError(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader
          title="Cadet Registration"
          subtitle="Enlist in the ASTRION expedition and begin your scientific journey."
        />

        {/* Global Error Banner */}
        {!!apiError && (
          <View style={styles.errorBanner}>
            <Text style={styles.bannerIcon}>🚨</Text>
            <Text style={styles.errorBannerText}>{apiError}</Text>
          </View>
        )}

        {/* Simulated Registration Success Notice */}
        {!!simulatedSuccess && (
          <View style={styles.successBanner}>
            <View style={styles.successHeader}>
              <Text style={styles.bannerIcon}>🎉</Text>
              <Text style={styles.successTitle}>Cadet Profile Created (ID #{simulatedSuccess.id})</Text>
            </View>
            <Text style={styles.successBody}>
              Mock registration confirmed for <Text style={styles.boldText}>{simulatedSuccess.email}</Text>!
            </Text>
            <View style={styles.noticeBox}>
              <Text style={styles.noticeIcon}>ℹ️</Text>
              <Text style={styles.noticeText}>
                <Text style={styles.boldNotice}>DummyJSON Simulation Notice:</Text> DummyJSON's{' '}
                <Text style={styles.codeText}>POST /users/add</Text> endpoint simulates user creation in-memory and
                does not save new accounts to its persistent authentication database. To log into the application, please
                use standard DummyJSON credentials (e.g. <Text style={styles.codeText}>emilys</Text>).
              </Text>
            </View>
            <AuthButton
              title="Proceed to Sign In  →"
              onPress={onNavigateToLogin}
              style={styles.successButton}
            />
          </View>
        )}

        {/* Registration Form */}
        {!simulatedSuccess && (
          <View style={styles.formCard}>
            <AuthInput
              label="Full Name"
              placeholder="e.g. Sally Ride"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
              }}
              autoCapitalize="words"
              error={errors.fullName}
            />

            <AuthInput
              label="Email Address"
              placeholder="e.g. explorer@astrion.space"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              error={errors.email}
            />

            <AuthInput
              label="Password"
              placeholder="At least 6 characters"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              isPassword
              error={errors.password}
            />

            <AuthInput
              label="Confirm Password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              isPassword
              error={errors.confirmPassword}
            />

            <AuthButton
              title="Create Mission Account  →"
              onPress={handleRegister}
              isLoading={isSubmitting}
              style={styles.submitButton}
            />

            {/* Back to Login */}
            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Already enlisted?</Text>
              <TouchableOpacity onPress={onNavigateToLogin} activeOpacity={0.7}>
                <Text style={styles.switchLink}> Sign In Instead</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorBg,
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  bannerIcon: {
    fontSize: 18,
  },
  errorBannerText: {
    flex: 1,
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  successBanner: {
    backgroundColor: colors.surface,
    borderColor: colors.success,
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.success,
  },
  successBody: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  boldText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  noticeBox: {
    flexDirection: 'row',
    backgroundColor: colors.warningBg,
    borderColor: colors.warning,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    gap: 8,
    marginBottom: 16,
  },
  noticeIcon: {
    fontSize: 16,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#FDE68A',
    lineHeight: 17,
  },
  boldNotice: {
    fontWeight: '700',
    color: '#F59E0B',
  },
  codeText: {
    fontFamily: 'monospace',
    fontWeight: '700',
    color: colors.primary,
  },
  successButton: {
    marginTop: 4,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  submitButton: {
    marginTop: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  switchText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  switchLink: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
