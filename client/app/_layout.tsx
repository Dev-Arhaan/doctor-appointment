import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Doctor Dashboard',
          }}
        />
        <Stack.Screen
          name="appointment/[id]"
          options={{
            title: 'Appointment Details',
          }}
        />
      </Stack>
    </Provider>
  );
}