import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Appointment } from '../types';
import { Colors } from '../constants/colors';

interface AppointmentCardProps {
  appointment: Appointment;
}

/**
 * A reusable card component to display a summary of an appointment.
 * It is wrapped in a Link to navigate to the appointment's detail screen.
 */
const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  // Format the date and time to be more readable for the user.
  const formattedTime = new Date(appointment.appointmentTime).toLocaleString([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    // `asChild` prop passes the press event to the child `TouchableOpacity`.
    // This is the recommended way to make custom components navigable with expo-router.
    <Link href={`/appointment/${appointment.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.patientName}>{appointment.patientName}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: Colors.status[appointment.status] }]} />
            <Text style={[styles.statusText, { color: Colors.status[appointment.status] }]}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.symptoms} numberOfLines={2}>
          Symptoms: {appointment.symptoms}
        </Text>
        <Text style={styles.time}>{formattedTime}</Text>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android shadow
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0000000D', // a very light, transparent background
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  symptoms: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  time: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.primary,
    textAlign: 'right',
  },
});

export default AppointmentCard;
