# Overview

Web Analytics Platform is a scalable, real-time analytics system built with Next.js, designed to track, process, and visualize user event data across websites and services. It combines a full-stack Next.js application with AWS infrastructure to deliver reliable event ingestion, asynchronous processing, and live dashboard updates.

> [Live Project](#) — replace with your deployed link

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Upcoming Features](#upcoming-features)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later)
- [Git](https://git-scm.com/downloads)
- An AWS account with access to EC2, SQS, and appropriate IAM permissions
- [Docker](https://www.docker.com/) installed for background worker deployment

### Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/rahul-ringane/web-analytics-platform.git && cd web-analytics-platform
```

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Deploy Background Workers

Background workers run on AWS EC2 inside Docker containers to handle asynchronous event processing:

```bash
docker build -t analytics-worker .
docker run -d --env-file .env.local analytics-worker
```

## Features

- **Real-Time Event Tracking**: Captures, processes, and analyzes user events as they happen, enabling immediate insight into platform activity.

- **Full-Stack Next.js Architecture**: Frontend and backend are built entirely with Next.js, using API routes for event ingestion and analytics endpoints.

- **Multi-Region Uptime Monitoring**: Continuously checks the status of websites and services across multiple regions, ensuring reliable global availability monitoring.

- **Asynchronous Event Processing**: Uses Amazon SQS to queue events, with background workers deployed on AWS EC2 via Docker to process them without blocking the main application.

- **Live Dashboard Updates**: WebSocket connections push real-time updates to dashboards, so analytics stay current without manual refreshes.

- **Interactive Visualizations**: Charts and graphs display key metrics such as user engagement and traffic trends, making data easy to interpret at a glance.

## Upcoming Features

- **Advanced Filtering & Segmentation**: Allow users to filter analytics by custom event properties, time ranges, and user segments.

- **Alerting System**: Notify users when uptime checks fail or traffic anomalies are detected.

- **Bug Fixes & Performance Improvements**: Ongoing work to improve reliability and reduce latency under high event volume.

## Tech Stack

- **Frontend & Backend**: Next.js
- **Compute**: AWS EC2
- **Messaging Queue**: AWS SQS
- **Containerization**: Docker
- **Real-Time Communication**: WebSockets

## Contributing

Contributions are welcome! If you'd like to contribute to Web Analytics Platform, please follow these steps:

1.  **Fork the repository.**

2.  **Create a new branch:** `git checkout -b feature/YourFeature`

3.  **Commit your changes:** `git commit -am "Add new feature"`

4.  **Push to the branch:** `git push origin feature/YourFeature`

5.  **Open a Pull Request** describing your changes and the problem they solve.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.