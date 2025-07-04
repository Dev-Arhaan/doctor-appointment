import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { useGetAppointmentsQuery } from '../store/apiSlice';
import AppointmentCard from '../components/AppointmentCard';
import { Colors } from '../constants/colors';

export default function AppointmentsListScreen() {
  const {
    data: appointments,
    error,
    isLoading,
    isFetching, 
    refetch, 
  } = useGetAppointmentsQuery({});

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.infoText}>Loading appointments...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Failed to load appointments.</Text>
        <Text style={styles.errorText}>{JSON.stringify(error)}</Text>
        <Button title="Retry" onPress={refetch} color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        renderItem={({ item }) => <AppointmentCard appointment={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.centeredContainer}>
            <Text style={styles.infoText}>No appointments found.</Text>
          </View>
        }
        onRefresh={refetch}
        refreshing={isFetching} 
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
