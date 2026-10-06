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
import Field from '@/components/Field';
import Header from '@/components/Header';
import { GridBackdrop } from '@/components/TechDecor';
import type { Theme } from '@/constants/theme';
import { signIn } from '@/lib/auth';
import { getProfile } from '@/lib/profiles';
import { useTheme, useThemedStyles } from '@/lib/theme';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await signIn(email.trim(), password);

      if (authError) {
        setError(authError.message);
      } else {
        // Teachers land in the create-events section; students on Home.
        const profile = data.session
          ? await getProfile(data.session.user.id)
          : null;
        const metadataRole =
          (data.session?.user?.user_metadata?.role as 'student' | 'teacher' | undefined) ??
          null;
        const finalRole = profile?.role ?? metadataRole ?? 'student';
        router.replace(
          finalRole === 'teacher' ? '/(tabs)/teacher' : '/(tabs)'
        );
      }
    } catch (err: any) {
      setError(err?.message || 'Unexpected error');
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

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to record your attendance</Text>

            <Card style={styles.formCard}>
              <View style={styles.form}>
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
                  icon="lock-closed-outline"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
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
                    title="Sign In"
                    icon="log-in-outline"
                    onPress={handleLogin}
                  />
                )}
              </View>
            </Card>

            <Link href="/register" style={styles.link}>
              Don't have an account? Sign Up
            </Link>
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
  });
