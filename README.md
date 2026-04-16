# COMP4442_SemesterProject_Group34
COMP4442 Group 34  Cloud‑based File Management System Group Memebers：Wan Chun Ho, Chan Chi Hon, Chu Wing Ho Dickens 

## Database Setup
FileSystemDatabase.sql is the schema file

## Server Deployment & Setup
This project is a cloud file system developed using Spring Boot.
The backend service and frontend files are deployed on an AWS EC2 instance.

### To connect to the EC2 server
On Windows Powershell, run ssh -i comp4442-key.pem ec2-user@13.211.75.71 to enter the EC2 server

### Inside EC2, required installation
Install Java, run
sudo yum update -y
sudo yum install java-17-amazon-corretto -y

Install Git, run
sudo yum install git -y

Install MariaDB Server, run
sudo dnf install mariadb105-server -y
sudo systemctl start mariadb
sudo systemctl enable mariadb
sudo mysql_secure_installation
sudo mysql

When entering into the MySQL server for the first time, run
CREATE DATABASE fileclouddb;
USE fileclouddb;
ALTER USER 'root'@'localhost'
IDENTIFIED VIA mysql_native_password
USING PASSWORD('YourStrongPassword123!');
FLUSH PRIVILEGES;
EXIT;

Install Maven, run
sudo dnf install maven -y

### Clone the GitHub Project
run in EC2 server
git clone https://github.com/<your-group>/<your-repo>.git
cd fms

### Build & Run Spring Boot
chmod +x mvnw
./mvnw clean package
java -jar target/*.jar

## How to Use the System
The application is deployed on AWS EC2 and can be accessed via a web browser:
http://13.211.75.71:8080/index.html

## System development
For development, all the codes will be written locally, afterwards, the source code will be uploaded to Github

## Runtime Environment
Cloud Platform: AWS EC2
Operating System: Amazon Linux
Java Version: Java 17
Database: MariaDB (MySQL‑compatible)
Web Server: Embedded Tomcat (Spring Boot)
Default Port: 8080
