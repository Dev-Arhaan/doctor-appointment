import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { useGetAppointmentsQuery } from '../store/apiSlice';
import AppointmentCard from '../components/AppointmentCard';
import { Colors } from '../constants/colors';

/**
 * The main screen of the app, displaying a list of appointments.
 * It handles loading, error, and empty states for the data fetch.
 */
export default function AppointmentsListScreen() {
  // Use the auto-generated hook to fetch appointments.
  // We pass an empty object because we are not applying any filters initially.
  const {
    data: appointments,
    error,
    isLoading,
    isFetching, // True on initial load and for refetches
    refetch, // A function to manually trigger a refetch
  } = useGetAppointmentsQuery({});

  // 1. Handle the initial loading state
  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.infoText}>Loading appointments...</Text>
      </View>
    );
  }

  // 2. Handle the error state
  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Failed to load appointments.</Text>
        {/* 'error' is a complex object, so we stringify it to see details during development */}
        <Text style={styles.errorText}>{JSON.stringify(error)}</Text>
        <Button title="Retry" onPress={refetch} color={Colors.primary} />
      </View>
    );
  }

  // 3. Handle the success state
  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        renderItem={({ item }) => <AppointmentCard appointment={item} />}
        keyExtractor={(item) => item.id}
        // Show a message if the list is empty
        ListEmptyComponent={
          <View style={styles.centeredContainer}>
            <Text style={styles.infoText}>No appointments found.</Text>
          </View>
        }
        // Enable pull-to-refresh
        onRefresh={refetch}
        refreshing={isFetching} // Show the refresh indicator while fetching
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContentContainer: {
    paddingVertical: 8,
    // If the list is empty, the container should still fill the screen
    flexGrow: 1,
  },
  infoText: {
    marginTop: 8,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 10,
  },
});
