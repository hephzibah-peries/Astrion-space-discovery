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
import { DemoCredentialsCard } from '../components/DemoCredentialsCard';
import { useAuth } from '../context/AuthContext';
import { validateIdentifier, validatePassword } from '../utils/validation';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToRegister,
}) => {
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleIdentifierChange = (text: string) => {
    setIdentifier(text);
    if (errors.identifier) {
      setErrors((prev) => ({ ...prev, identifier: undefined }));
    }
    if (apiError) setApiError(null);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
    if (apiError) setApiError(null);
  };

  const handleApplyDemoCredentials = (demoId: string, demoPass: string) => {
    setIdentifier(demoId);
    setPassword(demoPass);
    setErrors({});
    setApiError(null);
  };

  const handleLogin = async () => {
    setApiError(null);

    // Run field validations
    const identifierValidation = validateIdentifier(identifier);
    const passwordValidation = validatePassword(password);

    if (!identifierValidation.isValid || !passwordValidation.isValid) {
      setErrors({
        identifier: identifierValidation.error,
        password: passwordValidation.error,
      });
      return;
    }

    setIsSubmitting(true);
    const result = await login({ identifier, password });
    setIsSubmitting(false);

    if (!result.success) {
      setApiError(result.error || 'Authentication failed. Please verify credentials.');
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
          title="Explorer Sign In"
          subtitle="Enter your credentials to access planetary telemetries and celestial archives."
        />

        {/* Global Error Banner */}
        {!!apiError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorIcon}>🚨</Text>
            <Text style={styles.errorBannerText}>{apiError}</Text>
          </View>
        )}

        {/* Login Form */}
        <View style={styles.formCard}>
          <AuthInput
            label="Email or Username"
            placeholder="e.g. emilys or explorer@astrion.space"
            value={identifier}
            onChangeText={handleIdentifierChange}
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.identifier}
            helperText="Accepts DummyJSON username or registered email."
          />

          <AuthInput
            label="Password"
            placeholder="••••••••••••"
            value={password}
            onChangeText={handlePasswordChange}
            isPassword
            error={errors.password}
          />

          <AuthButton
            title="Authenticate & Launch  →"
            onPress={handleLogin}
            isLoading={isSubmitting}
            style={styles.loginButton}
          />

          {/* Navigation to Registration */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>New cadet to ASTRION?</Text>
            <TouchableOpacity onPress={onNavigateToRegister} activeOpacity={0.7}>
              <Text style={styles.switchLink}> Register Mission Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Demo Credentials Helper */}
        <DemoCredentialsCard onApplyCredentials={handleApplyDemoCredentials} />
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
  errorIcon: {
    fontSize: 18,
  },
  errorBannerText: {
    flex: 1,
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
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
  loginButton: {
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
