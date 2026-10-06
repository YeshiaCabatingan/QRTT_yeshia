import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import Card from '@/components/Card';
import { withAlpha, type Theme } from '@/constants/theme';
import { useAuth } from '@/lib/auth';
import {
  getAttendanceHistory,
  getTeacherEventAttendance,
  type AttendanceRecord,
  type TeacherEventAttendance,
} from '@/lib/attendance';
import { getProfile, type Role } from '@/lib/profiles';
import { useTheme, useThemedStyles } from '@/lib/theme';

export default function HistoryScreen() {
  const { user } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [studentRecords, setStudentRecords] = useState<AttendanceRecord[]>([]);
  const [teacherEvents, setTeacherEvents] = useState<TeacherEventAttendance[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);

  const load = useCallback(async () => {
    if (!user) {
      setRole(null);
      setStudentRecords([]);
      setTeacherEvents([]);
      setLoading(false);
      return;
    }

    try {
      const profile = await getProfile(user.id);
      const currentRole = profile?.role ?? 'student';
      setRole(currentRole);

      if (currentRole === 'teacher') {
        const events = await getTeacherEventAttendance(user.id);
        setTeacherEvents(events);
        setStudentRecords([]);
      } else {
        const records = await getAttendanceHistory(user.id);
        setStudentRecords(records);
        setTeacherEvents([]);
      }
    } catch {
      setStudentRecords([]);
      setTeacherEvents([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Attendance History</Text>
        <View style={styles.empty}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.subtitle}>Loading records...</Text>
        </View>
      </View>
    );
  }

  if (role === 'teacher') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Attendance History</Text>

        {teacherEvents.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="folder-open-outline" size={46} color={theme.textSecondary} />
            <Text style={styles.subtitle}>
              No events yet. Create an event from the Teacher tab to start
              collecting attendance.
            </Text>
          </View>
        ) : (
          <FlatList
            data={teacherEvents}
            keyExtractor={(item) => item.eventId}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <Card accent style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>
                      {item.attendeeCount}
                    </Text>
                  </View>
                </View>

                <Text style={styles.eventMetaMono}>{item.eventCode}</Text>
                {item.startTime ? (
                  <Text style={styles.eventMeta}>
                    Starts {formatDate(item.startTime)}
                  </Text>
                ) : null}

                <View style={styles.attendeeList}>
                  {item.attendees.length === 0 ? (
                    <Text style={styles.eventMeta}>No scans yet.</Text>
                  ) : (
                    item.attendees.map((attendee) => (
                      <View
                        key={attendee.studentId}
                        style={styles.attendeeRow}
                      >
                        <View style={styles.attendeeIdentity}>
                          <View style={[styles.attendeeDot, { backgroundColor: theme.success }]} />
                          <Text style={styles.attendeeName}>
                            {attendee.studentName?.trim()
                              ? attendee.studentName
                              : shortId(attendee.studentId)}
                          </Text>
                        </View>
                        <Text style={styles.attendeeTime}>
                          {formatDate(attendee.scannedAt)}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
              </Card>
            )}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance History</Text>

      {studentRecords.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="scan-outline" size={46} color={theme.textSecondary} />
          <Text style={styles.subtitle}>
            No records yet. Scan a QR code to register your attendance.
          </Text>
        </View>
      ) : (
        <FlatList
          data={studentRecords}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.eventTitle}>{item.eventTitle}</Text>
                <View style={styles.presentBadge}>
                  <Ionicons name="checkmark" size={12} color={theme.success} />
                  <Text style={[styles.presentText, { color: theme.success }]}>
                    PRESENT
                  </Text>
                </View>
              </View>
              <Text style={styles.eventMetaMono}>{item.eventId}</Text>
              <Text style={styles.eventMeta}>{formatDate(item.scannedAt)}</Text>
            </Card>
          )}
        />
      )}
    </View>
  );
}

function shortId(id: string) {
  return id ? `…${id.slice(-8)}` : 'unknown';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
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
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginTop: 12,
      paddingHorizontal: 24,
    },
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 60,
    },
    list: {
      paddingBottom: 24,
    },
    card: {
      marginBottom: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    eventTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 4,
      flexShrink: 1,
      marginRight: 8,
    },
    eventMeta: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 2,
    },
    eventMetaMono: {
      fontSize: 12,
      color: theme.primary,
      marginTop: 4,
      fontWeight: '600',
      fontFamily: 'monospace',
      letterSpacing: 0.5,
    },
    countBadge: {
      backgroundColor: theme.primary,
      borderRadius: theme.radius.chip,
      minWidth: 30,
      paddingHorizontal: 9,
      paddingVertical: 5,
      alignItems: 'center',
      marginBottom: 4,
    },
    countBadgeText: {
      color: theme.textOnPrimary,
      fontSize: 13,
      fontWeight: '700',
    },
    presentBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: withAlpha(theme.success, 0.14),
      borderRadius: theme.radius.chip,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginBottom: 4,
    },
    presentText: {
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.6,
      marginLeft: 4,
    },
    attendeeList: {
      marginTop: 10,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 8,
    },
    attendeeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 6,
    },
    attendeeIdentity: {
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
      marginRight: 8,
    },
    attendeeDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      marginRight: 8,
    },
    attendeeName: {
      fontSize: 14,
      color: theme.textPrimary,
      flexShrink: 1,
    },
    attendeeTime: {
      fontSize: 12,
      color: theme.textSecondary,
      fontFamily: 'monospace',
    },
  });
