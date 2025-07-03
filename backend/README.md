# 📘 Doctor Appointment API Documentation

Base URL: `https://yourdomain.com/api`

---

## 📅 Appointments

### 🔹 GET `/appointments`

**Description:** Get a list of all appointments with optional filters.
**Query Parameters:**

* `status` – Filter by status (`pending`, `confirmed`, `cancelled`, etc.)
* `date` – Filter by specific date (e.g., `2025-07-03`)
* `doctorId` – Filter by doctor
* `patientId` – Filter by patient

**Response:**

```json
[
  {
    "id": "123",
    "patientId": "p001",
    "doctorId": "d001",
    "date": "2025-07-03",
    "time": "14:30",
    "status": "confirmed"
  },
  ...
]
```

---

### 🔹 GET `/appointments/:id`

**Description:** Get details of a specific appointment by ID.
**Response:**

```json
{
  "id": "123",
  "patientId": "p001",
  "doctorId": "d001",
  "date": "2025-07-03",
  "time": "14:30",
  "status": "confirmed"
}
```

---

### 🔹 POST `/appointments`

**Description:** Create a new appointment.
**Request Body:**

```json
{
  "patientId": "p001",
  "doctorId": "d001",
  "date": "2025-07-03",
  "time": "14:30"
}
```

**Response:**

```json
{
  "message": "Appointment created",
  "appointmentId": "123"
}
```

---

### 🔹 PATCH `/appointments/:id/status`

**Description:** Update the status of an existing appointment.
**Request Body:**

```json
{
  "status": "confirmed"
}
```

**Response:**

```json
{
  "message": "Appointment status updated"
}
```

---

## 💊 Prescriptions

### 🔹 POST `/prescriptions`

**Description:** Create a new prescription for an appointment.
**Request Body:**

```json
{
  "appointmentId": "123",
  "doctorId": "d001",
  "patientId": "p001",
  "medications": [
    { "name": "Paracetamol", "dosage": "500mg", "frequency": "Twice a day" }
  ],
  "notes": "Take after food."
}
```

**Response:**

```json
{
  "message": "Prescription created",
  "prescriptionId": "456"
}
```

---

### 🔹 GET `/prescriptions/appointment/:appointmentId`

**Description:** Get the prescription for a specific appointment.
**Response:**

```json
{
  "prescriptionId": "456",
  "appointmentId": "123",
  "doctorId": "d001",
  "patientId": "p001",
  "medications": [
    { "name": "Paracetamol", "dosage": "500mg", "frequency": "Twice a day" }
  ],
  "notes": "Take after food."
}
```

---

## ✅ Status Codes

* `200 OK` – Success
* `201 Created` – Resource created
* `400 Bad Request` – Invalid input
* `404 Not Found` – Resource not found
* `500 Internal Server Error` – Server error

---

Would you like a downloadable `.md` file version or auto-generated Swagger/OpenAPI docs too?
Here's your complete **API documentation in Markdown format** based on the detailed examples you provided. Save it as `API_DOCUMENTATION.md`:

---

````markdown
# 🩺 Doctor Appointment App – API Documentation

**Base URL:** `http://localhost:3000`

---

## 🚦 1. Health Check

### `GET /health`

**Description:** Check if the server is running and healthy.

**cURL Example:**
```bash
curl -X GET http://localhost:3000/health
````

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "appointmentsCount": 5,
    "prescriptionsCount": 1,
    "timestamp": "2024-12-15T10:30:00.000Z",
    "uptime": 123.45,
    "environment": "development"
  },
  "message": "Server is healthy"
}
```

---

## 📅 2. Appointments

### 🔹 `GET /api/appointments`

**Description:** Retrieve all appointments with optional filters.

**cURL Examples:**

```bash
curl -X GET http://localhost:3000/api/appointments
curl -X GET "http://localhost:3000/api/appointments?status=scheduled&doctorId=doc_001"
curl -X GET "http://localhost:3000/api/appointments?date=2024-12-15"
```

**Expected Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "apt_001",
      "patientName": "John Doe",
      "age": 35,
      "symptoms": "Persistent cough and mild fever for 3 days",
      "appointmentTime": "2024-12-15T10:00:00.000Z",
      "status": "scheduled",
      "doctorId": "doc_001",
      "createdAt": "2024-12-10T08:00:00.000Z",
      "updatedAt": "2024-12-10T08:00:00.000Z"
    }
  ],
  "message": "Retrieved 1 appointments"
}
```

---

### 🔹 `GET /api/appointments/:id`

**Description:** Retrieve a single appointment by ID.

**cURL Example:**

```bash
curl -X GET http://localhost:3000/api/appointments/apt_001
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "id": "apt_001",
    "patientName": "John Doe",
    "age": 35,
    "symptoms": "Persistent cough and mild fever for 3 days",
    "appointmentTime": "2024-12-15T10:00:00.000Z",
    "status": "scheduled",
    "doctorId": "doc_001",
    "createdAt": "2024-12-10T08:00:00.000Z",
    "updatedAt": "2024-12-10T08:00:00.000Z"
  },
  "message": "Appointment retrieved successfully"
}
```

---

### 🔹 `POST /api/appointments`

**Description:** Create a new appointment.

**cURL Example:**

```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Alice Smith",
    "age": 29,
    "symptoms": "Chronic headaches and dizziness",
    "appointmentTime": "2024-12-20T14:30:00.000Z",
    "doctorId": "doc_001"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "id": "apt_1734261234567_abc123",
    "patientName": "Alice Smith",
    "age": 29,
    "symptoms": "Chronic headaches and dizziness",
    "appointmentTime": "2024-12-20T14:30:00.000Z",
    "status": "scheduled",
    "doctorId": "doc_001",
    "createdAt": "2024-12-15T10:30:00.000Z",
    "updatedAt": "2024-12-15T10:30:00.000Z"
  },
  "message": "Appointment created successfully"
}
```

---

### 🔹 `PATCH /api/appointments/:id/status`

**Description:** Update the status of an appointment.

**cURL Example:**

```bash
curl -X PATCH http://localhost:3000/api/appointments/apt_001/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "id": "apt_001",
    "patientName": "John Doe",
    "age": 35,
    "symptoms": "Persistent cough and mild fever for 3 days",
    "appointmentTime": "2024-12-15T10:00:00.000Z",
    "status": "completed",
    "doctorId": "doc_001",
    "createdAt": "2024-12-10T08:00:00.000Z",
    "updatedAt": "2024-12-15T10:35:00.000Z"
  },
  "message": "Appointment status updated successfully"
}
```

---

## 💊 3. Prescriptions

### 🔹 `POST /api/prescriptions`

**Description:** Create a new prescription.

**cURL Example:**

```bash
curl -X POST http://localhost:3000/api/prescriptions \
  -H "Content-Type: application/json" \
  -d '{
    "appointmentId": "apt_001",
    "medicineName": "Amoxicillin",
    "dosage": "500mg three times daily",
    "instructions": "Take with food. Complete the full course even if symptoms improve."
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "id": "pres_1734261234567_def456",
    "appointmentId": "apt_001",
    "medicineName": "Amoxicillin",
    "dosage": "500mg three times daily",
    "instructions": "Take with food. Complete the full course even if symptoms improve.",
    "createdAt": "2024-12-15T10:40:00.000Z",
    "doctorId": "doc_001"
  },
  "message": "Prescription created successfully"
}
```

---

### 🔹 `GET /api/prescriptions/appointment/:appointmentId`

**Description:** Retrieve prescription by appointment ID.

**cURL Example:**

```bash
curl -X GET http://localhost:3000/api/prescriptions/appointment/apt_001
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "id": "pres_1734261234567_def456",
    "appointmentId": "apt_001",
    "medicineName": "Amoxicillin",
    "dosage": "500mg three times daily",
    "instructions": "Take with food. Complete the full course even if symptoms improve.",
    "createdAt": "2024-12-15T10:40:00.000Z",
    "doctorId": "doc_001"
  },
  "message": "Prescription retrieved successfully"
}
```

---

## ❌ 4. Error Testing Examples

### Invalid Appointment ID

```bash
curl -X GET http://localhost:3000/api/appointments/invalid_id
```

**Expected:**

```json
{
  "success": false,
  "error": "Appointment not found"
}
```

---

### Missing Required Fields

```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "John Doe"
  }'
```

**Expected:**

```json
{
  "success": false,
  "error": "All fields are required: patientName, age, symptoms, appointmentTime, doctorId"
}
```

---

### Duplicate Prescription

```bash
curl -X POST http://localhost:3000/api/prescriptions \
  -H "Content-Type: application/json" \
  -d '{
    "appointmentId": "apt_003",
    "medicineName": "Ibuprofen",
    "dosage": "400mg twice daily"
  }'
```

**Expected:**

```json
{
  "success": false,
  "error": "Prescription already exists for this appointment"
}
```

---

## 📬 5. Postman Collection Setup

### Recommended Endpoints

| Method | URL                                             | Description                        |
| ------ | ----------------------------------------------- | ---------------------------------- |
| GET    | `{{baseUrl}}/health`                            | Server health check                |
| GET    | `{{baseUrl}}/api/appointments`                  | Get all appointments               |
| GET    | `{{baseUrl}}/api/appointments/:id`              | Get appointment by ID              |
| POST   | `{{baseUrl}}/api/appointments`                  | Create a new appointment           |
| PATCH  | `{{baseUrl}}/api/appointments/:id/status`       | Update appointment status          |
| POST   | `{{baseUrl}}/api/prescriptions`                 | Create prescription                |
| GET    | `{{baseUrl}}/api/prescriptions/appointment/:id` | Get prescription by appointment ID |

### Environment Variables

```text
baseUrl = http://localhost:3000
```

---

## ✅ 6. Testing Checklist

* [ ] Server starts without errors
* [ ] Health check returns 200
* [ ] All appointments endpoint works
* [ ] Single appointment retrieval works
* [ ] Appointment creation succeeds with valid data
* [ ] Appointment creation fails with missing data
* [ ] Appointment status update succeeds
* [ ] Prescription creation works
* [ ] Duplicate prescription returns error
* [ ] CORS headers enabled
* [ ] JSON responses correctly formatted
