import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useCreatePrescriptionMutation } from '../store/apiSlice';
import { Colors } from '../constants/colors';

interface PrescriptionFormModalProps {
  visible: boolean;
  onClose: () => void;
  appointmentId: string;
  patientName: string;
}

const PrescriptionFormModal: React.FC<PrescriptionFormModalProps> = ({
  visible,
  onClose,
  appointmentId,
  patientName,
}) => {
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');

  const [createPrescription, { isLoading, isSuccess, isError, error }] = useCreatePrescriptionMutation();

  useEffect(() => {
    if (isSuccess) {
      onClose(); 
      setMedicineName('');
      setDosage('');
      setInstructions('');
    }
  }, [isSuccess, onClose]);

  useEffect(() => {
    if (isError && error) {
        const errorMessage = 'data' in error && error.data ? (error.data as any).error : 'An unknown error occurred.';
        Alert.alert('Submission Failed', errorMessage);
    }
  }, [isError, error]);


  const handleSubmit = async () => {
    if (!medicineName.trim() || !dosage.trim()) {
      Alert.alert('Validation Error', 'Medicine Name and Dosage are required.');
      return;
    }

    await createPrescription({
      appointmentId,
      medicineName,
      dosage,
      instructions,
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>New Prescription</Text>
          <Text style={styles.patientName}>For: {patientName}</Text>

          <TextInput
            style={styles.input}
            placeholder="Medicine Name (e.g., Amoxicillin)"
            placeholderTextColor={Colors.textSecondary}
            value={medicineName}
            onChangeText={setMedicineName}
          />
          <TextInput
            style={styles.input}
            placeholder="Dosage (e.g., 500mg three times daily)"
            placeholderTextColor={Colors.textSecondary}
            value={dosage}
            onChangeText={setDosage}
          />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Instructions (optional)"
            placeholderTextColor={Colors.textSecondary}
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={3}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose} disabled={isLoading}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalView: {
    margin: 20,
    width: '90%',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 25,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 4,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  patientName: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  input: {
    height: 50,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: Colors.background,
  },
  multilineInput: {
      height: 80,
      textAlignVertical: 'top',
      paddingTop: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 14,
    elevation: 2,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.textSecondary,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default PrescriptionFormModal;
