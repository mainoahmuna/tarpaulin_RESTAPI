# Tarpaulin API

The Tarpaulin API supports the backend functionalities of Tarpaulin, a lightweight course management tool designed as an alternative to Canvas. It offers robust endpoints for course information retrieval, assignment management, student submissions, and secure authentication using MySQL for data storage.

## Features

- **Course Management**: Retrieve course details, instructor information, and student enrollment.
- **Assignment Operations**: Create, update, and delete assignments with deadlines and grading criteria.
- **Student Submissions**: Allow students to submit assignments and view submission statuses.
- **Authentication**: Secure API endpoints with JWT authentication for authorized access.
- **Error Handling**: Comprehensive error handling to provide clear feedback to users.

## Technologies Used

- Node.js
- Express.js
- MySQL
- JWT (JSON Web Tokens) for authentication
- Postman for API testing
- Swagger for API documentation
- Git and GitHub for version control and repository management

## Getting Started

To get started with Tarpaulin API, clone the repository and follow these steps:

1. Install dependencies:
    `npm install`
3. Set up your environment variables for MySQL connection details and JWT secret key.

## Starting the server
## Run the MYSQL Docker Container
`docker run -d --name mysqlserver -p 3306:3306 -e "MYSQL_RANDOM_ROOT_PASSWORD=yes" -e "MYSQL_DATABASE=tarpaulin" -e "MYSQL_USER=**\<username>**" -e "MYSQL_PASSWORD=**\<password>**" mysql`
## Run the Redis container for rate limit caching
`docker run -d --name redis-container -p 6379:6379 redis`
## Run the RabbitMQ container for offline work
`docker run -d --name rabbitmq-server -p "5672:5672" -p "15672:15672" rabbitmq:management`
## Add the following fields to your .env file
<ul>
    <li>MYSQL_DATABASE</li>
    <li>MYSQL_USER</li>
    <li>MYSQL_PASSWORD`</li>
</ul>

## Run the program
`npm run dev`

## What I Learned

Developing the Tarpaulin API project provided valuable insights into several key areas:

- **API Design and Development**: Structuring RESTful endpoints to efficiently manage course data and assignments.
- **Database Integration**: Utilizing MySQL for data storage and retrieval, including schema design and query optimization.
- **Authentication and Security**: Implementing JWT authentication to secure API endpoints and manage user access.
- **Error Handling and Validation**: Implementing robust error handling mechanisms and data validation to ensure data integrity and user experience.
- **API Testing**: Performing thorough testing with Postman to ensure reliability and functionality.
