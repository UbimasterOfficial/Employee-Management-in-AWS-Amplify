# Employee Management System 

A full-stack Employee Management System built using the MERN stack and deployed on AWS cloud infrastructure. <br>

This application allows users to create, view, update, and delete employee records through a responsive web interface. The project demonstrates cloud deployment, Linux server administration, networking configuration, SSL/TLS security, and production-ready Node.js application management.

## Live Architecture

React + Vite (AWS Amplify) <br>
            &emsp;&emsp;&emsp;&emsp;&emsp;│ <br>
            &emsp;&emsp;&emsp;&emsp;&emsp;▼ <br>
      &emsp;&emsp;&emsp; HTTPS (SSL) <br>
            &emsp;&emsp;&emsp;&emsp;&emsp;│ <br>
            &emsp;&emsp;&emsp;&emsp;&emsp;▼ <br>
      &emsp;Nginx Reverse Proxy <br>
            &emsp;&emsp;&emsp;&emsp;&emsp;│ <br>
            &emsp;&emsp;&emsp;&emsp;&emsp;▼ <br>
 Node.js + Express API (EC2) <br>
           &emsp;&emsp;&emsp;&emsp;&emsp;│ <br>
          &emsp;&emsp;&emsp;&emsp;&emsp;▼ <br>
     &emsp;&emsp; MongoDB Atlas <br><br>
     
## Sample Preview
https://github.com/user-attachments/assets/9773aa85-a3b9-410d-a066-ca350fefad43

## Features
     
● Create, Read, Update, and Delete Employees <br>
● RESTful API using Express.js <br>
● Responsive React Frontend <br>
● Secure HTTPS Communication <br>
● Cloud-hosted MongoDB Database <br>
● Production-ready Node.js deployment using PM2 <br>

## AWS & DevOps Services Used

● AWS Amplify <br>
● Amazon EC2 <br>
● VPC <br>
● Public Subnet <br>
● Internet Gateway <br>
● Route Tables <br>
● Security Groups <br>
● Elastic IP <br>
● Nginx <br>
● PM2<br>
● MongoDB Atlas<br>
● SSL/TLS Certificate<br>

## API Endpoints

POST &emsp;  /api/users <br>
GET  &emsp;  /api/users <br>
GET  &emsp;  /api/users/:id <br>
PUT  &emsp;  /api/users/:id <br>
DELETE &emsp; /api/users/:id <br>

## Local Development
### Frontend

-> cd Frontend <br>
-> npm install <br>
-> npm run dev <br>

### Backend

-> cd Backend <br>
-> npm install <br>
-> npm run dev <br>

## Key Challenges Solved

● Connected MongoDB Atlas with EC2-hosted backend <br>
● Managed Node.js applications on Ubuntu Linux <br>
● Configured AWS Amplify for frontend deployment <br>
● Resolved HTTPS ↔ HTTP mixed content issues <br>
● Configured hostname, DNS, and SSL certificates <br>
● Implemented Nginx reverse proxy <br>
● Managed application uptime using PM2 <br>
● Configured AWS networking components (VPC, Subnets, Security Groups, Route Tables) <br>

## Skills Demonstrated

● AWS Cloud Deployment <br>
● Linux Administration <br>
● Node.js Application Hosting <br>
● HTTPS & SSL Configuration <br>
● Nginx Reverse Proxy <br>
● PM2 Process Management <br>
● MongoDB Atlas Integration <br>
● Networking & Security <br>
● Troubleshooting Production Issues <br>

## Future Improvements

● Docker Containerization <br>
● GitHub Actions CI/CD <br>
● Terraform Infrastructure as Code <br>
● Kubernetes Deployment <br>
● Monitoring & Logging <br>
 
