import { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import AppButton from '@/components/AppButton';
import Card from '@/components/Card';
import Field from '@/components/Field';
import type { Theme } from '@/constants/theme';
import { useAuth, signOut, syncProfile } from '@/lib/auth';
import {
  getProfile,
  updateProfile,
  type Profile,
  type Role,
} from '@/lib/profiles';
import { useTheme, useThemedStyles } from '@/lib/theme';

export default function ProfileScreen() {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    // Self-heal first: apply the signup intent / metadata if the row is stale
    // (e.g. an account created before the role fix), then show the DB truth.
    await syncProfile(session);
    const p = await getProfile(user.id);
    setProfile(p);
    setDraftName(p?.full_name ?? '');
  }, [user, session]);

  const metadataRole =
    (session?.user?.user_metadata?.role as Role | undefined) ?? null;
  const effectiveRole: Role =
    profile?.role === 'teacher' || metadataRole === 'teacher'
      ? 'teacher'
      : 'student';

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const handleSaveName = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await updateProfile(user.id, {
      full_name: draftName.trim(),
    });
    setSaving(false);
    if (error) {
      Alert.alert('Error', error);
    } else {
      setProfile((prev) =>
        prev ? { ...prev, full_name: draftName.trim() } : prev
      );
      setEditing(false);
    }
  };

  const handleSwitchRole = async () => {
    if (!user || !profile) return;
    const next: Role = effectiveRole === 'teacher' ? 'student' : 'teacher';
    setSaving(true);
    const { error } = await updateProfile(user.id, { role: next });
    setSaving(false);
    if (error) {
      Alert.alert('Error', error);
    } else {
      setProfile((prev) => (prev ? { ...prev, role: next } : prev));
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      router.replace('/login');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to sign out.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      {effectiveRole === 'teacher' ? (
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>Teacher</Text>
        </View>
      ) : (
        <View style={[styles.roleBadge, styles.roleBadgeStudent]}>
          <Text style={[styles.roleBadgeText, styles.roleBadgeTextStudent]}>
            Student
          </Text>
        </View>
      )}

      <Card style={styles.infoCard}>
        <Text style={styles.label}>Name</Text>
        {editing ? (
          <View style={styles.nameEditRow}>
            <Field
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Enter your name"
              editable={!saving}
              style={styles.nameInput}
            />
            <Pressable
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSaveName}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? '...' : 'Save'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={() => setEditing(true)} style={styles.nameRow}>
            <Text style={styles.value}>
              {profile?.full_name || 'Tap to add your name'}
            </Text>
            <Text style={styles.editHint}>Edit</Text>
          </Pressable>
        )}

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{profile?.email ?? user?.email ?? '—'}</Text>

        <Text style={styles.label}>Role</Text>
        <View style={styles.roleRow}>
          <Text style={styles.value}>
            {effectiveRole === 'teacher' ? 'Teacher' : 'Student'}
          </Text>
          <Pressable
            onPress={handleSwitchRole}
            disabled={saving || !profile}
            style={[styles.roleSwitch, (saving || !profile) && styles.saveButtonDisabled]}
          >
            <Text style={styles.saveButtonText}>
              {saving
                ? '...'
                : effectiveRole === 'teacher'
                ? 'Make Student'
                : 'Make Teacher'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.roleHint}>
          Role is set when you sign up. If an older account still says
          Student, tap the button to switch it.
        </Text>

        <Text style={styles.label}>User ID</Text>
        <Text style={styles.valueMono}>{user?.id ?? '—'}</Text>
      </Card>

      <AppButton
        title="Customize UI"
        icon="color-palette-outline"
        onPress={() => router.push('/appearance')}
      />
      <AppButton
        title="Sign Out"
        icon="log-out-outline"
        tone="danger"
        variant="soft"
        onPress={handleSignOut}
        disabled={loading}
      />
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 24,
      paddingTop: 24,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 12,
    },
    pressed: {
      opacity: 0.75,
      transform: [{ scale: 0.97 }],
    },
    roleBadge: {
      alignSelf: 'flex-start',
      backgroundColor: theme.primary,
      borderRadius: theme.radius.chip,
      paddingHorizontal: 14,
      paddingVertical: 6,
      marginBottom: 16,
    },
    roleBadgeStudent: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    roleBadgeText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.textOnPrimary,
    },
    roleBadgeTextStudent: {
      color: theme.textPrimary,
    },
    infoCard: {
      marginBottom: 24,
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.textSecondary,
      marginBottom: 4,
      marginTop: 8,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
    value: {
      fontSize: 15,
      color: theme.textPrimary,
      fontWeight: '500',
    },
    valueMono: {
      fontSize: 12,
      color: theme.textSecondary,
      fontFamily: 'monospace',
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    roleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    roleSwitch: {
      backgroundColor: theme.primary,
      borderRadius: theme.radius.button,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    roleHint: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 6,
      lineHeight: 17,
    },
    editHint: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.primary,
    },
    nameEditRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    nameInput: {
      flex: 1,
      backgroundColor: theme.surface,
      marginRight: 8,
      fontSize: 15,
      paddingVertical: 10,
    },
    saveButton: {
      backgroundColor: theme.primary,
      borderRadius: theme.radius.button,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      color: theme.textOnPrimary,
      fontSize: 14,
      fontWeight: '700',
    },
  });
