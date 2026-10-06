import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useFocusEffect } from 'expo-router';

import AppButton from '@/components/AppButton';
import Card from '@/components/Card';
import Chip from '@/components/Chip';
import Field from '@/components/Field';
import type { Theme } from '@/constants/theme';
import { withAlpha } from '@/constants/theme';
import { useAuth, syncProfile } from '@/lib/auth';
import { createEvent } from '@/lib/events';
import { getProfile, type Role } from '@/lib/profiles';
import { buildQRPayload } from '@/lib/qr';
import { useTheme, useThemedStyles } from '@/lib/theme';

function toLocalISO(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
  );
}

function formatDateTime(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  return `${month} ${pad(date.getDate())}, ${date.getFullYear()} at ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

const QUICK_END_OPTIONS = [
  { label: '+30 min', ms: 30 * 60 * 1000 },
  { label: '+1 hour', ms: 60 * 60 * 1000 },
  { label: '+2 hours', ms: 2 * 60 * 60 * 1000 },
];

type EditTarget = 'start' | 'end';

export default function TeacherScreen() {
  const { user, session } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [eventId, setEventId] = useState('');
  const [startDate, setStartDate] = useState(() => new Date());
  const [endDate, setEndDate] = useState(
    () => new Date(Date.now() + 60 * 60 * 1000)
  );
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [editingPart, setEditingPart] = useState<'date' | 'time'>('date');
  const [payload, setPayload] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageError, setMessageError] = useState(false);
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (!user) {
        setRoleLoading(false);
        return () => {
          active = false;
        };
      }
      (async () => {
        let profile = await getProfile(user.id);
        const metadataRole =
          (session?.user?.user_metadata?.role as 'student' | 'teacher' | undefined) ??
          null;

        if ((profile?.role ?? 'student') !== 'teacher' && metadataRole !== 'teacher') {
          // Self-heal: apply the signup intent / metadata, then re-read —
          // so a stale row repairs itself while you look at this screen.
          await syncProfile(session);
          profile = await getProfile(user.id);
        }
        if (!active) return;
        const finalRole = profile?.role ?? metadataRole ?? 'student';
        setRole(finalRole);
        setRoleLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [user, session])
  );

  const isAndroid = Platform.OS === 'android';

  const openPicker = (target: EditTarget) => {
    setMessage(null);
    setMessageError(false);
    setEditTarget(target);
    setEditingPart('date');
  };

  const onPickerChange = (
    event: DateTimePickerEvent,
    selected?: Date
  ) => {
    if (!editTarget) return;
    if (event.type === 'dismissed' || !selected) {
      setEditTarget(null);
      setEditingPart('date');
      return;
    }

    const current = editTarget === 'start' ? startDate : endDate;
    const next = new Date(current);
    next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
    next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);

    if (editTarget === 'start') setStartDate(next);
    else setEndDate(next);

    if (isAndroid && editingPart === 'date') {
      setEditingPart('time');
    } else {
      setEditTarget(null);
      setEditingPart('date');
    }
  };

  const handleQuickEnd = (ms: number) => {
    setMessage(null);
    setMessageError(false);
    setEndDate(new Date(startDate.getTime() + ms));
  };

  const handleCreateEvent = async () => {
    const event = {
      eventId: eventId.trim(),
      title: title.trim(),
      start: toLocalISO(startDate),
      end: toLocalISO(endDate),
    };

    if (!event.eventId || !event.title) {
      setMessage('Event title and code are required.');
      setMessageError(true);
      return;
    }

    if (endDate.getTime() <= startDate.getTime()) {
      setMessage('End time must be after start time.');
      setMessageError(true);
      return;
    }

    try {
      const { error } = await createEvent(event);
      if (error) {
        throw new Error(error);
      }
      setMessage('Event saved! Scan the QR with the Scan tab to test it.');
      setMessageError(false);
      setPayload(buildQRPayload(event));
    } catch (err: any) {
      setMessage(err?.message || 'Could not save the event.');
      setMessageError(true);
    }
  };

  if (roleLoading) {
    return (
      <View style={styles.gateContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.gateText}>Checking your account...</Text>
      </View>
    );
  }

  if (role !== 'teacher') {
    return (
      <View style={styles.gateContainer}>
        <View style={styles.gateIcon}>
          <Ionicons
            name="lock-closed-outline"
            size={40}
            color={theme.textSecondary}
          />
        </View>
        <Text style={styles.gateTitle}>Teachers Only</Text>
        <Text style={styles.gateText}>Only teacher accounts can create events.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Create Event QR</Text>
      <Text style={styles.subtitle}>
        Fill in the event details, then scan the generated QR with the Scan tab.
      </Text>

      <Text style={styles.label}>Event Title</Text>
      <Field
        icon="megaphone-outline"
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Founders Day Assembly"
      />

      <Text style={styles.label}>Event Code</Text>
      <Field
        icon="barcode-outline"
        value={eventId}
        onChangeText={setEventId}
        placeholder="e.g. EVT-2026-0002"
        autoCapitalize="characters"
        style={styles.codeInput}
      />

      <Text style={styles.label}>Starts</Text>
      <PickerField
        value={formatDateTime(startDate)}
        icon="sunny-outline"
        onPress={() => openPicker('start')}
      />

      <Text style={styles.label}>Ends</Text>
      <PickerField
        value={formatDateTime(endDate)}
        icon="moon-outline"
        onPress={() => openPicker('end')}
      />
      <View style={styles.chipRow}>
        {QUICK_END_OPTIONS.map((option) => (
          <Chip
            key={option.label}
            label={option.label}
            variant="accent"
            onPress={() => handleQuickEnd(option.ms)}
            style={styles.chip}
          />
        ))}
      </View>
      <Text style={styles.hint}>Tap a chip to set the end time from start.</Text>

      {message && (
        <View
          style={[
            styles.messageBox,
            { backgroundColor: messageError ? withAlpha(theme.danger, 0.12) : theme.primarySoft },
          ]}
        >
          <Ionicons
            name={messageError ? 'alert-circle-outline' : 'checkmark-circle-outline'}
            size={16}
            color={messageError ? theme.danger : theme.primary}
            style={styles.messageIcon}
          />
          <Text
            style={[
              styles.message,
              messageError && styles.messageError,
              { color: messageError ? theme.danger : theme.primary },
            ]}
          >
            {message}
          </Text>
        </View>
      )}

      <AppButton
        theme="primary"
        title="Create Event"
        icon="add-circle-outline"
        onPress={handleCreateEvent}
      />

      {editTarget && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={editTarget === 'start' ? startDate : endDate}
            mode={isAndroid ? editingPart : 'datetime'}
            display={isAndroid ? 'default' : 'spinner'}
            onChange={onPickerChange}
          />
        </View>
      )}

      {payload && (
        <Card style={styles.resultCard}>
          <Text style={styles.resultTitle}>
            Scan this QR code with the Scan tab:
          </Text>
          <View style={styles.qrBox}>
            <QRCode value={payload} size={200} />
          </View>
          <Text style={styles.payloadText}>{payload}</Text>
        </Card>
      )}
    </ScrollView>
  );
}

type PickerFieldProps = {
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

function PickerField({ value, icon, onPress }: PickerFieldProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable
      style={({ pressed }) => [styles.pickerField, pressed && styles.pickerFieldPressed]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={20} color={theme.primary} />
      <Text style={styles.pickerValue}>{value}</Text>
      <Ionicons name="calendar-outline" size={18} color={theme.textSecondary} />
    </Pressable>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    gateContainer: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    gateIcon: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    gateTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.textPrimary,
      marginTop: 12,
    },
    gateText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 6,
    },
    content: {
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 40,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: 16,
    },
    label: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.textSecondary,
      marginBottom: 6,
      marginTop: 12,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    codeInput: {
      fontFamily: 'monospace',
      letterSpacing: 1,
      fontSize: 15,
    },
    pickerField: {
      backgroundColor: theme.card,
      borderRadius: theme.radius.input,
      borderWidth: 1.5,
      borderColor: theme.border,
      paddingHorizontal: 14,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
    },
    pickerFieldPressed: {
      backgroundColor: theme.surface,
      transform: [{ scale: 0.99 }],
    },
    pickerValue: {
      flex: 1,
      fontSize: 15,
      fontWeight: '500',
      color: theme.textPrimary,
      marginHorizontal: 10,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    chip: {
      marginRight: 8,
      marginBottom: 0,
    },
    hint: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 8,
    },
    pickerContainer: {
      marginTop: 12,
      alignItems: 'center',
    },
    messageBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderRadius: theme.radius.input,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginTop: 14,
    },
    messageIcon: {
      marginRight: 6,
      marginTop: 1,
    },
    message: {
      flex: 1,
      fontSize: 14,
      textAlign: 'left',
      lineHeight: 19,
    },
    messageError: {
      fontWeight: '600',
    },
    resultCard: {
      marginTop: 20,
      alignItems: 'center',
    },
    resultTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.textPrimary,
      textAlign: 'center',
      marginBottom: 12,
    },
    qrBox: {
      backgroundColor: '#FFFFFF',
      padding: 12,
      borderRadius: theme.radius.md,
      marginBottom: 12,
    },
    payloadText: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 16,
      fontFamily: 'monospace',
    },
  });
