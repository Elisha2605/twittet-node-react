# Welcome to the app that will change lifes
<sub>Developer: Elisha Ngoma</sub>

This is a web application built as part of my bachelor project. The app mimics the functionality of Twitter, allowing users to create accounts, post tweets, follow other users, and engage with their tweets through likes and comments.

The app is built using HTML, CSS, React in the frontend, and Node.js with express and TypeScript on the backend. It utilizes various APIs to fetch and display real-time data such as trending topics and user profiles.

The purpose of this project is to demonstrate my proficiency in web development and showcase my understanding of popular web technologies. Feel free to explore the app and provide any feedback or suggestions for improvements. 


## Stak:

- `front-end`: React & TypeScript
- `back-end`: Node.js with Express, TypeScript & Mongoose.


## Setup Information and File Structure

### Scripts

- `start:server`: "nodemon --exec ts-node -r dotenv/config -r tsconfig-paths/register server/index.ts": 
This script starts the server using nodemon and runs the TypeScript files using ts-node. The -r flag is used to 
register dotenv/config and tsconfig-paths/register before running the server.

- `start:client`: "cd client && npm start": This script starts the client by changing into the client directory and running npm start.

- `start`: "concurrently \"npm run start:server\" \"npm run start:client\"": This script starts both the server and client concurrently using the concurrently package.

- `build:server`: "tsc -p .": This script builds the server using tsc (TypeScript compiler) by running tsc -p . in the current directory.

- `build:client`: "cd client && npm run build": This script builds the client by changing into the client directory and running npm run build.

- `build`: "npm run build:server && npm run build:client": This script builds both the server and client.

- `dev`: "concurrently \"npm run start:server\" \"cd client && npm start\"": This script starts both the server and client in development mode using concurrently.


### Server Folder Structure

The server folder structure is as follows:

- `index.ts`: The entry point of the application. When the application is started, it runs the code in this file.

- `src/app.ts`: Contains the middleware and routing logic for the application.

- `src/routes`: Contains the routers for the application.

- `src/controllers`: Contains the controllers for the application.

- `src/models`: Contains the models for the application.


### Client Folder Structure

The client folder structure is as follows:

- `components`: Contains reusable UI components, such as buttons, forms, and modals.

- `pages`: Contains top-level page components, such as a LoginPage, DashboardPage, and ProfilePage.

- `api`: Contains files that handle communication with the backend API.

- `utils`: Contains utility functions that are used across the application.

- `store`: Contains files that define and manage the application state.

- `assets`: Contains static assets, such as images and fonts.

- `styles`: Contains global styles and utility classes that are used across the application.

- `config`: Contains configuration files, such as environment variables or API base URL.


### After cloning this repo:

- `npm install`: from the `root` folder.

- `npm install`: from the `client` folder.


### Connect to the DB:

- `.env`: You should create the `.env` file and add the following variables:
    - `PORT`=4000
    - `MONGODB_CONNECTION_STRING`=mongodb+srv://`<username>`:`<password>`@cluster0.9iajcdb.mongodb.net/`<dbname>`?retryWrites=true&w=majority`
    
   > make sure to replace the `<username>`, `<password>` and `<dbname>` with you own credentials.


### How to run the scripts and what they do.

- `npm run dev`: This command starts both the server and client in development mode using `concurrently`.

- `npm run start:server`: This command starts the server using nodemon and runs the TypeScript files using ts-node.

- `npm run start:client`: This command starts the client by changing into the client directory and running `npm start`.

- `npm run build:server`: This command builds the server using tsc (TypeScript compiler) by running `tsc -p .` in the current directory.

- `npm run build:client`: This command builds the client by changing into the client directory and running `npm run build`.

- `npm run build`: This command builds both the server and client.