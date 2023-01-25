# MoonBloc Project by using NextJs framework


## Starting MoonBloc with Docker Compose 🐳

To start the application, you first need to build the container images using the `docker-compose build` command. This will download any necessary dependencies and build the container images for your application.
````
docker-compose build
````
Once the container images have been built, you can start the application using the `docker-compose up -d` command. This will create and start the containers in detached mode (`-d`) for your application.
````
docker-compose up -d
````
You should now be able to see the running containers using the `docker ps` command. If everything is working correctly, you should see your application running and accessible via the URL or IP address of your server.
````
docker ps
````
Note that you can also use the `docker-compose down` command to stop and remove the containers.

## Deploying MoonBloc in Development Mode 👨🏼‍💻

Before starting the development server, you need to install all the dependencies required by your application by running the command `npm install`.
````
npm install
````
Once the dependencies are installed, you can run the command `npm run dev` to start the MoonBloc application in development mode. This command will start the development server and allow you to make changes and see the updates in real-time.
````
npm run dev
````
The application will be available in your browser at `http://localhost:3000`. With development mode you can make changes to your code and the browser will hot-reload the changes without losing the state of your application, it allows you to test your application and debug it easily.

It's important to note that you need to have Node.js and npm installed on your machine, in order to run the command successfully.

This way you make sure that all the dependencies are installed and ready to use before running the development server, and you don't have to worry about any missing dependencies that could cause errors.

