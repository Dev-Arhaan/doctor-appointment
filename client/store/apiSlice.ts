import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Appointment, AppointmentStatus, NewPrescription, Prescription, SuccessResponse } from '../types';

interface GetAppointmentsParams {
  status?: AppointmentStatus;
  doctorId?: string;
  date?: string; 
}

export const apiSlice = createApi({
  reducerPath: 'api', 
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL, 
  }),
  tagTypes: ['Appointment', 'Prescription'],
  endpoints: (builder) => ({
    getAppointments: builder.query<Appointment[], GetAppointmentsParams>({
      query: (params) => ({
        url: '/api/appointments',
        params, 
      }),
      transformResponse: (response: SuccessResponse<Appointment[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Appointment' as const, id })),
              { type: 'Appointment', id: 'LIST' },
            ]
          : [{ type: 'Appointment', id: 'LIST' }],
    }),
    
    getAppointmentById: builder.query<Appointment, string>({
      query: (id) => `/api/appointments/${id}`,
      transformResponse: (response: SuccessResponse<Appointment>) => response.data,
      providesTags: (result, error, id) => [{ type: 'Appointment', id }],
    }),
    
    updateAppointmentStatus: builder.mutation<Appointment, { id: string; status: AppointmentStatus }>({
      query: ({ id, status }) => ({
        url: `/api/appointments/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: (response: SuccessResponse<Appointment>) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: 'Appointment', id },
        { type: 'Appointment', id: 'LIST' }, 
      ],
    }),
    
    getPrescriptionForAppointment: builder.query<Prescription, string>({
      query: (appointmentId) => `/api/prescriptions/appointment/${appointmentId}`,
      transformResponse: (response: SuccessResponse<Prescription>) => response.data,
      providesTags: (result, error, appointmentId) => [{ type: 'Prescription', id: appointmentId }],
    }),

    createPrescription: builder.mutation<Prescription, NewPrescription>({
      query: (body) => ({
        url: '/api/prescriptions',
        method: 'POST',
        body,
      }),
      transformResponse: (response: SuccessResponse<Prescription>) => response.data,
      invalidatesTags: (result, error, { appointmentId }) => [{ type: 'Prescription', id: appointmentId }],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useUpdateAppointmentStatusMutation,
  useGetPrescriptionForAppointmentQuery,
  useCreatePrescriptionMutation,
} = apiSlice;