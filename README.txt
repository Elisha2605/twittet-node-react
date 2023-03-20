## Scripts.

"start:server": "nodemon --exec ts-node -r dotenv/config -r tsconfig-paths/register server/index.ts": This script starts the server using nodemon and runs the TypeScript files using ts-node. The -r flag is used to register dotenv/config and tsconfig-paths/register before running the server.

"start:client": "cd client && npm start": This script starts the client by changing into the client directory and running npm start.

"start": "concurrently \"npm run start:server\" \"npm run start:client\"": This script starts both the server and client concurrently using the concurrently package.

"build:server": "tsc -p .": This script builds the server using tsc (TypeScript compiler) by running tsc -p . in the current directory.

"build:client": "cd client && npm run build": This script builds the client by changing into the client directory and running npm run build.

"build": "npm run build:server && npm run build:client": This script builds both the server and client.

"dev": "concurrently \"npm run start:server\" \"cd client && npm start\"": This script starts both the server and client in development mode using concurrently.


### server folder structure
The index.ts file in the root folder of the project is the entry point of 
the application. When the application is started, it runs the code in this file.

The index.ts file imports the app object from app.ts file in the src folder, 
and calls the listen method to start the server listening on a specific port.

The app.ts file contains the middleware and routing logic for the application.

The app.ts file imports the routers from the routes folder and the controllers 
from the controllers folder. It then uses the routers to define the URL routes 
for the application, and assigns each route to a corresponding controller method.

When a client makes a request to the server, the appropriate route in the routes 
folder is matched based on the URL path and HTTP method.

The route handler method in the controller associated with the route is called, 
which typically calls a method in the corresponding service to handle the business logic of the request.

The service method may use the models in the models folder to perform 
CRUD operations on the database, or call other external services to complete the operation.

The service method returns a response to the controller method, which 
formats the response and sends it back to the client as an HTTP response.



## client folder structure
components: This folder would contain your reusable UI components, such as buttons, forms, and modals.

pages: This folder would contain your top-level page components, such as a LoginPage, DashboardPage, and ProfilePage.

api: This folder would contain files that handle communication with your backend API. You could separate each API endpoint into its own file, or group related endpoints into the same file.

utils: This folder would contain utility functions that are used across your application, such as formatting dates or handling errors.

store: This folder would contain files that define and manage your application state, such as a Redux store or a Vuex store.

assets: This folder would contain static assets, such as images and fonts.

styles: This folder would contain global styles and utility classes that are used across your application.

config: This folder would contain configuration files, such as your environment variables or your API base URL.