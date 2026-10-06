import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton';
import Card from '@/components/Card';
import Chip from '@/components/Chip';
import Field from '@/components/Field';
import Header from '@/components/Header';
import { GridBackdrop } from '@/components/TechDecor';
import type { Theme } from '@/constants/theme';
import { signUp } from '@/lib/auth';
import { useTheme, useThemedStyles } from '@/lib/theme';

type Role = 'student' | 'teacher';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError, verifiedRole } = await signUp(
        email.trim(),
        password,
        {
          full_name: fullName.trim(),
          role,
        }
      );

      if (authError) {
        setError(authError.message);
      } else if (data.session) {
        // Email confirmation is off, so a session exists right away.
        // Teachers go straight to the create-events section; students to Home.
        const metadataRole =
          (data.user?.user_metadata?.role as 'student' | 'teacher' | undefined) ??
          role;
        const finalRole = verifiedRole ?? metadataRole ?? role;
        router.replace(
          finalRole === 'teacher' ? '/(tabs)/teacher' : '/(tabs)'
        );
      } else {
        // Email confirmation is on — show the "check your email" message.
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <GridBackdrop cell={48} />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.headerContainer}>
              <Header title="QR Attendance" />
            </View>

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Register to start recording attendance</Text>

            {success ? (
              <Card style={styles.successContainer}>
                <Text style={styles.successTitle}>Check your email!</Text>
                <Text style={styles.successText}>
                  We sent a confirmation link to {email}. Click the link to verify your
                  account, then come back and sign in.
                </Text>
                <Link href="/login" style={styles.link}>
                  Back to Sign In
                </Link>
              </Card>
            ) : (
              <Card style={styles.formCard}>
                <View style={styles.form}>
                  <Text style={styles.label}>Full Name</Text>
                  <Field
                    icon="person-outline"
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="e.g. Juan Dela Cruz"
                    editable={!loading}
                  />

                  <Text style={styles.label}>I am a...</Text>
                  <View style={styles.roleRow}>
                    <Chip
                      label="Student"
                      active={role === 'student'}
                      onPress={() => setRole('student')}
                      style={styles.roleChip}
                    />
                    <Chip
                      label="Teacher"
                      active={role === 'teacher'}
                      onPress={() => setRole('teacher')}
                      style={styles.roleChip}
                    />
                  </View>

                  <Text style={styles.label}>Email</Text>
                  <Field
                    icon="mail-outline"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="your.email@school.edu"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!loading}
                  />

                  <Text style={styles.label}>Password</Text>
                  <Field
                    icon="key-outline"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="At least 6 characters"
                    secureTextEntry
                    editable={!loading}
                  />

                  <Text style={styles.label}>Confirm Password</Text>
                  <Field
                    icon="key-outline"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Re-enter your password"
                    secureTextEntry
                    editable={!loading}
                  />

                  {error && <Text style={styles.error}>{error}</Text>}

                  {loading ? (
                    <ActivityIndicator
                      size="large"
                      color={theme.primary}
                      style={styles.loader}
                    />
                  ) : (
                    <AppButton
                      theme="primary"
                      title="Sign Up"
                      icon="person-add-outline"
                      onPress={handleRegister}
                    />
                  )}
                </View>
              </Card>
            )}

            {!success && (
              <Link href="/login" style={styles.link}>
                Already have an account? Sign In
              </Link>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingBottom: 20,
    },
    headerContainer: {
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 15,
      lineHeight: 21,
      color: theme.textSecondary,
      marginBottom: 16,
    },
    formCard: {
      marginBottom: 16,
    },
    form: {
      marginBottom: 2,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 6,
      marginTop: 6,
    },
    roleRow: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    roleChip: {
      flex: 1,
      justifyContent: 'center',
      marginRight: 10,
      marginBottom: 0,
      paddingVertical: 12,
    },
    error: {
      fontSize: 14,
      color: theme.danger,
      textAlign: 'left',
      marginTop: 12,
      marginBottom: 4,
    },
    loader: {
      marginVertical: 16,
    },
    link: {
      fontSize: 14,
      color: theme.primary,
      textAlign: 'center',
      fontWeight: '600',
    },
    successContainer: {
      marginBottom: 24,
    },
    successTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 8,
      textAlign: 'center',
    },
    successText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 16,
    },
  });
