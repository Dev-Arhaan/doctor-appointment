import React, { useState } from 'react'; 
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import {
  useGetAppointmentByIdQuery,
  useGetPrescriptionForAppointmentQuery,
} from '../../store/apiSlice';
import { Colors } from '../../constants/colors';
import { Prescription } from '../../types';
import PrescriptionFormModal from '../../components/PrescriptionFormModal'; 

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [isModalVisible, setModalVisible] = useState(false);

  const {
    data: appointment,
    error: appointmentError,
    isLoading: isLoadingAppointment,
  } = useGetAppointmentByIdQuery(id!, { skip: !id });

  const {
    data: prescription,
    error: prescriptionError,
    isLoading: isLoadingPrescription,
  } = useGetPrescriptionForAppointmentQuery(appointment?.id!, {
    skip: !appointment?.id,
  });

  const renderLoading = () => (
    <View style={styles.centeredContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.infoText}>Loading Details...</Text>
    </View>
  );

  const renderError = (error: any) => (
    <View style={styles.centeredContainer}>
      <Text style={styles.errorText}>Failed to load data.</Text>
      <Text style={styles.errorText}>{JSON.stringify(error)}</Text>
    </View>
  );

  const renderDetailRow = (label: string, value: string | number) => (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  const renderPrescription = (pres: Prescription) => (
    <View style={styles.prescriptionContainer}>
      <Text style={styles.sectionTitle}>Prescription</Text>
      {renderDetailRow('Medicine', pres.medicineName)}
      {renderDetailRow('Dosage', pres.dosage)}
      {renderDetailRow('Instructions', pres.instructions)}
    </View>
  );

  const renderGenerateButton = () => (
    <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
      <Text style={styles.buttonText}>Generate Prescription</Text>
    </TouchableOpacity>
  );

  if (isLoadingAppointment) {
    return renderLoading();
  }

  if (appointmentError || !appointment) {
    return renderError(appointmentError);
  }

  const formattedTime = new Date(appointment.appointmentTime).toLocaleString([], {
    dateStyle: 'full',
    timeStyle: 'short',
  });
  const createdAt = new Date(appointment.createdAt).toLocaleDateString();

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Stack.Screen options={{ title: `${appointment.patientName}` }} />

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          {renderDetailRow('Name', appointment.patientName)}
          {renderDetailRow('Age', appointment.age)}
          {renderDetailRow('Status', appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1))}
          {renderDetailRow('Booked On', createdAt)}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          {renderDetailRow('Appointment Time', formattedTime)}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Symptoms</Text>
            <Text style={styles.symptomsValue}>{appointment.symptoms}</Text>
          </View>
        </View>

        <View style={styles.card}>
          {isLoadingPrescription && <ActivityIndicator color={Colors.primary} />}
          
          {prescription && renderPrescription(prescription)}
          
          {prescriptionError && 'status' in prescriptionError && prescriptionError.status !== 404 && (
               <Text style={styles.errorText}>Could not load prescription.</Text>
          )}

          {!prescription && !isLoadingPrescription && renderGenerateButton()}
        </View>
      </ScrollView>

      <PrescriptionFormModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        appointmentId={appointment.id}
        patientName={appointment.patientName}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    color: Colors.textSecondary,
    flex: 1,
  },
  value: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  symptomsValue: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    flex: 2,
    textAlign: 'left',
    marginTop: 8,
  },
  infoText: {
    marginTop: 8,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
  },
  prescriptionContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
