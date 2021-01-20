# Backend Application - ManulifeMOVE

## Description

This application implements RESTful services, which allow CSV data to flow in and have a way to query the data out as JSON format

***

## Local Setup

### Installing project dependencies

Ensure that Node v10+ is installed. Open your terminal and run:

```bash
npm install
```

>_tip_: **npm i** is shorthand for **npm install**

### Running the Server Locally

To run the server locally in developer mode, open terminal and run:

```bash
npm run dev
```

This will run the server on port 8082 and start nodemon to provide live preview of the application while under development

## Configure MySQL server

This application connects to MySQL server on port 3306 to store the CSV parsed data. Please ensure that you have setup the MySQL server before running the application.

> Important: The `config.ts` file available inside `src/config/config.ts` provides the reference to MySQL credentials. For development mode use the credentials under `"dev"` property.

## Shipping for Production

To deploy the application for production, there are two methods available.

### Method 1 - Classic Deployment

Open your terminal and run:

```bash
npm run build
```

This will create a build folder `www` that can be deployed to the production environment (your Virtual Machine) directly.

### Method 2 - Container Deployment

Ensure that you have docker installed on your machine. Open your terminal and run:

```bash
docker build -t backend_manulife .
```

This will build a docker image of your application. Then you can run a container from this image on Container Orchestration platforms like Kubernetes, Docker Swarm etc. To run the container locally on your machine and map your local 8082 port to container 8082 port, open the terminal and run:

```bash
docker run --name backend_container -d -p 8082:8082 backend_manulife
```
