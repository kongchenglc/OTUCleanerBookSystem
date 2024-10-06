# OTU Cleaner Reservation System

This system is designed to connect employers (homeowners or landlords) with cleaners for house cleaning services. Employers can schedule cleanings, choose their preferred cleaner, and manage bookings, while cleaners can manage their availability, accept jobs, and receive payments through the platform.

## Stakeholders

- **Homeowners (Employers)**: Use the platform to find and hire cleaners for house cleaning services.
- **Cleaners**: Use the platform to offer cleaning services, manage availability, and accept job offers.

## Functional Requirements

### 1. User Registration and Login
- Both cleaners and employers can create accounts, log in, and manage their profiles.

### 2. Cleaner Profile Management
- Cleaners can set up their profile, including availability, location, and rates.

### 3. Search and Filter
- Employers can search for cleaners based on:
  - Location
  - Rating
  - Price comparison
  - Availability

### 4. Job Scheduling
- Employers can schedule appointments with cleaners.
- Cleaners can accept or reject job offers.

### 5. Payment Processing
- The platform supports payments for cleaning services.
- Employers can pay and cleaners can receive funds through the system.

### 6. Notifications
- Employers and cleaners receive notifications about:
  - Upcoming bookings
  - Changes in schedules
  - Job reminders (1 day and 1 hour before the job)

### 7. Reviews and Ratings
- Employers and cleaners can leave reviews for each other after a job is completed.

## Non-Functional Requirements

### 1. Usability
- The system should have an easy-to-use interface for both employers and cleaners, ensuring minimal cognitive load.

### 2. Security
- User data and payment information should be encrypted and protected with proper authentication methods.

### 3. Performance
- The system should respond to user actions within an acceptable time frame to ensure smooth operation.

### 4. Availability
- The platform should have high uptime, ensuring it's available to users most of the time.

## Use Cases

### 1. Employer Use Case

- **Register/Login**: Register and log in to the platform.
- **Search and Filter Cleaners**: Search for available cleaners based on various criteria.
- **Schedule Cleaning Service**: Schedule a cleaning appointment with a selected cleaner.
- **Review and Rate Cleaners**: Leave reviews and rate the cleaner after a job.

### 2. Cleaner Use Case

- **Register/Login**: Register and log in to the platform.
- **Manage Profile**: Set up profile details including availability and pricing.
- **Accept/Reject Job Offers**: Manage job offers and bookings.
- **Receive Payments**: Get paid for completed services.
- **Review and Rate Employers**: Leave reviews and rate the employer after a job.

![usercases](/doc/usercase.png)


## Data Structure

### 1. **Employer (雇主)**

```plaintext
- id: Number (雇主 ID)
- name: String (雇主姓名)
- email: String (雇主电子邮件)
- address: String (雇主住址)
- bookings: Array<Booking> (雇主的预订列表)
```

### 2. **Cleaner (清洁工)**

```plaintext
- id: Number (清洁工 ID)
- name: String (清洁工姓名)
- email: String (清洁工电子邮件)
- location: String (清洁工服务地点)
- hourlyRate: Number (清洁工小时费率)
- availability: Array<TimeSlot> (清洁工的可用时间)
- bookings: Array<Booking> (清洁工的预定列表)
```

### 3. **Booking (预定)**

```plaintext
- id: Number (预定 ID)
- employerId: Number (雇主 ID)
- cleanerId: Number (清洁工 ID)
- date: String (预定日期，格式为 YYYY-MM-DD)
- time: String (预定时间，格式为 HH:mm)
- duration: Number (服务时长，单位小时)
- price: Number (总价格)
- status: String (预定状态，例如 'pending', 'accepted', 'rejected', 'completed')
```

### 4. **Review (评论与评分)**

```plaintext
- id: Number (评论 ID)
- bookingId: Number (关联的预定 ID)
- reviewerId: Number (评论者 ID，可能是雇主或清洁工)
- revieweeId: Number (被评论者 ID)
- rating: Number (评分，范围为 1-5)
- comment: String (评论内容)
```

### 5. **Notification (通知)**

```plaintext
- id: Number (通知 ID)
- userId: Number (接收通知的用户 ID)
- message: String (通知内容)
- createdAt: String (通知创建时间，格式为 YYYY-MM-DDTHH:mm:ss)
- read: Boolean (是否已读，默认为 false)
```

## Technology Stack
Front-end: JavaScript, React, Antd

Back-end: Node.js, Koa2

Database: MongoDB

Cloud Service: AWS