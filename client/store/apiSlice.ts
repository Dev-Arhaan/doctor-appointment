import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Appointment, AppointmentStatus, NewPrescription, Prescription, SuccessResponse } from '../types';

// Define the arguments for the getAppointments query
interface GetAppointmentsParams {
  status?: AppointmentStatus;
  doctorId?: string;
  date?: string; // Format YYYY-MM-DD
}

export const apiSlice = createApi({
  reducerPath: 'api', // The name of the slice in the Redux state
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL, // Get the base URL from .env
  }),
  // "Tags" are used for caching and automatic data re-fetching.
  tagTypes: ['Appointment', 'Prescription'],
  endpoints: (builder) => ({
    // Query to get a list of all appointments
    getAppointments: builder.query<Appointment[], GetAppointmentsParams>({
      query: (params) => ({
        url: '/api/appointments',
        params, // Pass filters as URL search parameters
      }),
      // Extract the `data` array from the API's wrapper response
      transformResponse: (response: SuccessResponse<Appointment[]>) => response.data,
      // This query "provides" a list of 'Appointment' tags.
      // If any mutation "invalidates" this tag, this query will re-run.
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Appointment' as const, id })),
              { type: 'Appointment', id: 'LIST' },
            ]
          : [{ type: 'Appointment', id: 'LIST' }],
    }),
    
    // Query to get a single appointment by its ID
    getAppointmentById: builder.query<Appointment, string>({
      query: (id) => `/api/appointments/${id}`,
      transformResponse: (response: SuccessResponse<Appointment>) => response.data,
      providesTags: (result, error, id) => [{ type: 'Appointment', id }],
    }),
    
    // Mutation to update an appointment's status
    updateAppointmentStatus: builder.mutation<Appointment, { id: string; status: AppointmentStatus }>({
      query: ({ id, status }) => ({
        url: `/api/appointments/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: (response: SuccessResponse<Appointment>) => response.data,
      // When this mutation runs, it "invalidates" these tags, forcing a refetch.
      invalidatesTags: (result, error, { id }) => [
        { type: 'Appointment', id },
        { type: 'Appointment', id: 'LIST' }, // Invalidate the whole list
      ],
    }),
    
    // Query to get a prescription for a specific appointment
    getPrescriptionForAppointment: builder.query<Prescription, string>({
      query: (appointmentId) => `/api/prescriptions/appointment/${appointmentId}`,
      transformResponse: (response: SuccessResponse<Prescription>) => response.data,
      providesTags: (result, error, appointmentId) => [{ type: 'Prescription', id: appointmentId }],
    }),

    // Mutation to create a new prescription
    createPrescription: builder.mutation<Prescription, NewPrescription>({
      query: (body) => ({
        url: '/api/prescriptions',
        method: 'POST',
        body,
      }),
      transformResponse: (response: SuccessResponse<Prescription>) => response.data,
      // After creating a prescription, invalidate the tag for that appointment's prescription.
      invalidatesTags: (result, error, { appointmentId }) => [{ type: 'Prescription', id: appointmentId }],
    }),
  }),
});

// Export the auto-generated hooks for use in your components
export const {
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useUpdateAppointmentStatusMutation,
  useGetPrescriptionForAppointmentQuery,
  useCreatePrescriptionMutation,
} = apiSlice;