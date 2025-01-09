# JNI Platform

![JNI_platform_logo](img/logo/jni-logo.png)

JNI Platform based on BaSyx Java V2 components fully compatible with the *Asset Administration Shell* v3. For each component, a multitude of backends (e.g., InMemory, MongoDB) as well as further features (MQTT, ...) are provided. 

The following off-the-shelf components are available:

* [JNI Frontend](aas-frontend)
* [JNI Backend](aas-backend)
* [JNI data-bridge](data-bridge)
* [JNI deployment](deployment)

## Linked scientific contributions 
This implementation is aligned with the IEC 63278 standard and the Asset Administration Shell vision of Industry 4.0. [This article](https://hal.science/hal-04612160/document) presents 19 criteria applied to the selection of existing open-source implementations, as well as the integration of these into a technical architecture and its implementation.

For more details about the State of the Art analysis and components selection criteria, please refer to this [paper](https://hal.science/hal-04612160/document)


## JNI Platform : docker-compose files
[docker-compose.yml](docker-compose.yml) configuration file illustrates the setup for the maven build and test project.

[docker-compose-centralized.yml](docker-compose-centralized.yml) configuration file contains all the docker images needed to run:
* [AAS Environment](basyx.aasenvironment).
* [AAS Registry](basyx.aasregistry)
* Front-end application (see project https://git.irt-systemx.fr/jni1/wp4/jni1-pocv1-frontend)
* DataBridge configuration used to integrate data sources within Asset Administration Shells (see project https://git.irt-systemx.fr/jni1/wp4/jni1-poc-v1-data-bridge).

You can find the dataBridge configuration folder (aasenvironment.databridge) under (basyx.aasenvironment/basyx.aasenvironment.component/src/main/resources).

We are providing `DEV` and `PROD` configs. To run the [docker-compose-centralized.yml](docker-compose-centralized.yml) file, you need to setup ${ENV} and ${HOST} environment variables first:
- 'ENV' variable contains the deploiment mode (DEV or PROD)
- 'HOST' variable for setting the host name or ip address (localhost or another domain name or ip address)

# Two deployment methods
**1. Centralized architecture:**
- Deployment of the AAS Environment component module that englobes the AAS Repository, Submodel Repository and Concept Description Repository modules.
- Deployment of the AAS Registry component module that provides the AAS descriptor object which contains endpoint information for the AAS Environment.
- Exposes a upload/serialization APIs that imports/exports an AAS model from/to a file(.json, .aasx or .xml).
- Allows a preconfiguring environment that contains AAS model files(.json, .aasx or .xml) or directories to load on startup.
- Uses all APIs exposed by the AASrepository, AASsubmodelrepository and conceptdescriptionrepository modules.
- Single entry point.
- Single database connection (contains all collections aas_repo, submodel_repo and conceptdescription_repo).

![centralized_architecture](img/aafa5088c0b99bbf2cd46bec5333b921/centralized_architecture.png)

To retrieve an AAS model in centralized architecture, you need to:
- Make a first call to the AAS Registry server to retrieve the AAS model descriptor (aas_id, server_endpoints, server_ipAdresse, server_protocols..) without any submodel information.
- Once you get the AAS Environment server endpoint from the AAS Registry, you make a second call using the retrieved endpoint and the /shells GET api of the aas repository that returns AAS model informations with only the submodels reference.
- Make a third call using the same AAS Environment server endpoint and the /submodels GET api that returns the submodels information.

**2. Distributed architecture:**

Independent deployment of different parts of the system:
- AAS Registry
- Submodel Registry
- AAS Repository
- Submodel Repository
- Concept Description Repository (optionally)

Several databases:
- a database for the AAS Registry
- a database for the Submodel Registry
- One database per component: AAS Repository, Submodel Repository and Concept Description Repository (possibility of having a single BD that encompasses all three components).

![distributed_architecture](img/3c9abf17135adf47150b0c6a87f8074d/distributed_architecture.png)

To retrieve an AAS model in distributed architecture, you must request each instance alone:
- Make a call to the AAS Registry server to retrieve the AAS Repository server endpoint.
- Make a call to the AAS Repository server using the retrieved endpoint to get the AAS model information with submodels reference.
- Make a call to the Submodel Registry server to retrieve the Submodel Repository endpoint.
- Make a call to the Submodel Repoitory to get submodels informations and values.

**JNI1 plateform architecture:**

![full_architecture](img/fbded30cbf9af2382c7eaa74606080a7/full_architecture.png)

# Documentation Mode Dev (windows)

- **Requirements Installation**

\- Java (version 11+)

\- Maven (version >3.x.x)

\- Git (version 2.41.0)

\- MongoDB: Download and install [MongoDB](https://www.mongodb.com/try/download/community) server

Connect to mongodb server and add user "mongoAdmin"

> `mongosh --port 27017`

> `use admin`

> `db.createUser({user:"mongoAdmin", pwd:"mongoPassword", roles:[{ role: "readWrite", db:"admin"}]});`	

> `db.auth("mongoAdmin","mongoPassword")`

after creating the user, you can connect to mongosh using this cmd:

> `mongosh --port 27017 -u mongoAdmin -p mongoPassword --authenticationDatabase admin`

\- Docker: Download and install Docker service (use [docker desktop](https://docs.docker.com/desktop/install/windows-install) for windows)

\- Download and install [Eclipse IDE](https://www.eclipse.org/downloads/packages/installer).

**Centralized architecture:**

- **Build Projects**

\- Import project jni1-pocv1-backend

\- After the import, check the database connections in application.properties file
```
basyx.backend = MongoDB
spring.data.mongodb.database=aasenvironments
spring.data.mongodb.uri = mongodb://mongoAdmin:mongoPassword@localhost:27017/aasenvironments?authSource=admin
```
\- Run `docker-compose up` to launch all the necessary services in the build and test of the different modules of the application in the docker-compose.yml file

\- Then, run `mvn clean install` using CMD or use Eclipse IDE:

![Aspose.Words.8b50efd6-b688-4934-94de-240b9bde690c.001](img/4675533f39653b22ac67677d31fda535/Aspose.Words.8b50efd6-b688-4934-94de-240b9bde690c.001.png)

![Aspose.Words.8b50efd6-b688-4934-94de-240b9bde690c.002](img/6af1ed13b602f96e36c1461940dc5dd6/Aspose.Words.8b50efd6-b688-4934-94de-240b9bde690c.002.png)

- **Run Projects**

\- Run the **AAS Enviroment** server:

Using Eclipse IDE, select the package basyx.aasenvironment.component, then do right click and run as “java application”, then select AasEnvironmentComponent java class

![Aspose.Words.8b50efd6-b688-4934-94de-240b9bde690c.003](img/9e33b31cceb0b9bfc1434c93809368c5/Aspose.Words.8b50efd6-b688-4934-94de-240b9bde690c.003.png)

Your AAS Environment server will be running on [localhost:8081](http://localhost:8081)

Swagger Apis on [http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html)

\- Run **AAS Registry** server:

The AAS registry is dockerized, use the docker file under the folder basyx.aasregistry\basyx.aasregistry-service-release-log-mongodb to build a docker image for aas registry mongoDB implementation.

Go to the basyx.aasregistry/basyx.aasregistry-service-release-log-mongodb folder then run `mvn clean install -DskipTests -Pdockerbuild` using CMD.

You can check the created image "aas-registry-log-mongodb:1.0.0" using `docker images` command.

Then run the aas-registry-log-mongodb docker image `docker run --env SPRING_DATA_MONGODB_URI=mongodb://mongoAdmin:mongoPassword@host.docker.internal:27017 -p 8080:8080 eclipsebasyx/aas-registry-log-mongodb:1.0.0`

PS: use 'host.docker.internal' to connect mongoDB from inside the docker daemon.

AAS Registry server is running on [localhost:8080](http://localhost:8080)

Swagger Apis on [http://localhost:8080/api/v3.0/swagger-ui/index.html](http://localhost:8080/api/v3.0/swagger-ui/index.html)	

\- Run **FrontEnd** application [jni1-pocv1-frontend](https://git.irt-systemx.fr/jni1/wp4/jni1-pocv1-frontend):

Install dependecies `yarn install`

Run the application `yarn dev` or `npm run dev`

Your front app is available on [http://localhost:3001](http://localhost:3001)

\- Run **DataBridge** application [jni1-poc-v1-data-bridge](https://git.irt-systemx.fr/jni1/wp4/jni1-poc-v1-data-bridge):

Import project using Eclipse IDE

Build the project using Eclipse IDE (see above capture of the AAS Environment) or use command `mvn clean install` in the root folder of the project.

Run the project using Eclipse IDE, in the main class DataBridgeExecutable.java, select Run Configurations…

![Aspose.Words.8b50efd6-b688-4934-94de-240b9bde690c.004](img/a40645c41e1ff6bf797b0c1ddccc9128/Aspose.Words.8b50efd6-b688-4934-94de-240b9bde690c.004.png)

Then, you need to add the path to your dataBridge config folder in the arguments

![Aspose.Words.8b50efd6-b688-4934-94de-240b9bde690c.005](img/c5bc785edc40022acf8e440dd5b57d47/Aspose.Words.8b50efd6-b688-4934-94de-240b9bde690c.005.png)

Then, do Run.

**Mock DataBridge httpsource server:**

For some dataBridge configurations, you need to mock an http server call on port 2018. (see httpconsumer.json file under databridge folder).

Use [Mockoon tool](https://mockoon.com/) to create http mock calls.

\- Download and install mockoon, then import the config mock server file under basyx.aasenvironment/basyx.aasenvironment.component/src/main/resources/aasenvironment.databridge/mock/mockHttpEmulatorServer.json

\- Start the imported mockoon server using the tool.

\- Your mock http server is started on [localhost:2018](http://localhost:2018).

**MQTT Client explorer:**

Use [MQTT Explorer](https://mqtt-explorer.com) for visualize, create and push topics on the mqtt server.

\- Download and install Mqtt-explorer

To connect the mqtt server:

\- use protocol websockets ws://

\- host: localhost

\- port: 1884

# Documentation Mode Staging (ubuntu 20.04)

Connect to the VM using ssh: `ssh ubuntu@192.168.211.155`

Use admin mode: `sudo su`

Create folder jni1 (if not exist) under /home/ubuntu `cd /home/ubuntu && mkdir jni1`

Download **Backend**, **FrontEnd** and **DataBridge** projects under jni1 (if not exist) using Git (already installed in Ubuntu 20.04)

\- clone projects:

\> `git config --global http.sslVerify false (disable ssl)`

\> `git clone -b develop-synchro https://git.irt-systemx.fr/jni1/wp4/jni1-pocv1-backend.git`

\> `git clone -b develop https://git.irt-systemx.fr/jni1/wp4/jni1-pocv1-frontend.git`

\> `git clone -b develop https://git.irt-systemx.fr/jni1/wp4/jni1-poc-v1-data-bridge.git`

Ps: Use `git config --global credential.helper store` to store git login and password in the server

Ps: git config and git credentials files are stored under ~/.gitconfig and ~/.git-credentials

Another useful git commands:

\> `git status` to check the current status of your branch

\> `git switch [Branch_Name]` to switch branch

\> `git fetch` to check remote branch changes

\> `git pull` to pull the new remote branch changes (if exist)

- **Requirements Installation**

\- Install Java 11+:

\> `apt-get update`

\> `apt install default-jdk` (will install java-11- openjdk under /usr/lib/jvm)

\> `export JAVA\_HOME=/usr/lib/jvm/java-11-openjdk-amd64`

\> `export PATH=$PATH:$JAVA\_HOME/bin`

\- Install Maven: 

\> `apt install maven` (version 3.6.3)

\- Install Docker: 

\> `snap refresh`

\> `snap install docker` (version docker 20.10.24, version docker-compose 2.17.2)

\- Install npm (v9.6.7) and node (v18.17.1):

\> `apt update`

\> `apt install npm`

\> `curl -sL https://deb.nodesource.com/setup\_18.x | sudo bash -`

\> `apt install -y nodejs`

\- Install yarn (v1.22.19):

\> `curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`

\> `echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`

\> `apt update && apt install --no-install-recommends yarn`

**Centralized architecture:**

- **Build Projects**

Go to the project jni1-pocv1-backend

\- Run docker-compose.yml `docker-compose up –build –remove-orphans`

\- Run `mvn clean install`

\- After the building, run `docker-compose down` to shutup docker services used during the build and tests phase

Build the docker images of every component for Centralized Architecture (AASEnvironment, AAS Registry, AAS Gui (FrontEnd), DataBridge)

- Buid **AAS Environment** Docker Image

\> `cd /basyx.aasenvironment/basyx.aasenvironment.component`

\> `docker build -t eclipsebasyx/aasenvironment:1.0.0 .`

- Buid **AAS Registry** Docker Image

\> `cd /basyx.aasregistry/basyx.aasregistry-service-release-log-mongodb`

\> `mvn clean install -DskipTests -Pdockerbuild`

- Build **AAS Gui** Docker Image

\> `cd /home/ubuntu/jni1/jni1-pocv1-frontend`

\> `npm install or yarn install`

\> `npm run build` (optional)

\> `docker build -t aas-web-ui_v2:1.0.0 .`

- Build **Data Bridge** Docker Image

\> `cd /home/ubuntu/jni1/jni1-poc-v1-data-bridge` 

\> `mvn clean install`

\> `cd databridge.component`

\> `mvn install -DskipTests -Pdocker`

- **Staging Environment Configuration**

After building all docker images, you need to check your configuration for the AAS Environment, AAS Registry and Data Bridge components:

\- You can find AAS Environment config under /home/ubuntu/jni1/jni1-pocv1-backend/basyx.aasenvironment/basyx.aasenvironment.component/src/main/resources/aasenvironment.databridge/PROD/application.properties

In docker-compose-centralized.yml file (located in the root folder jni1-pocv1-backend):

\- You can find the configuration volume mapping for the aas-env service. (You can also enable upload aas model on service startup).

\- You can find AAS Registry environment variables in docker-compose-centralized.yml file for database connection

\- You can find environment variables for AAS Gui image

\- Configuration folder for databrige under `cd /home/ubuntu/jni1/jni1-pocv1-backend/basyx.aasenvironment/basyx.aasenvironment.component/src/main/resources/aasenvironment.databridge/PROD`

\- You can find dataBridge configurations under the DEV or PROD folder. Under the folder `.../PROD/databridge`, you have all the configuration files that enable the mqtt event and http requests (with timer and with API) defined in routes.json file. 

Based on the current config in routes.json file, the API exposed by the databridge is the following: `http://[HOST]:8090/OilTemperatureOperationalLimitKMX`.
The timerconsumer.json file indicates that the timer is 10 sec (period: 10000) and the mqttconsumer.json file indicates that the mqtt event listen to the topic "Transformer/T_oil".
The jsonatatransformer.json and jsonataTemperature.jsonata files contains the data integration rules. The dataBridge expecting an MQTT json message that contains the property "OilTemperature" (example: {"OilTemperature": "40"}).

\- You need also to start an http server (mock) on port 2018 (used by the dataBridge component): A docker image “mockoon/cli:latest” is installed and uses the mock json data under /home/ubuntu/jni1/jni1-pocv1-backend/basyx.aasenvironment/basyx.aasenvironment.component/src/main/resources/aasenvironment.databridge/mock/mockHttpEmulatorServer.json. 

The mock is accessible throught this link: `http://[HOST]:2018`

- **Start docker images using docker-compose**

\- Run the mock server: `docker run -d --mount type=bind,source=/home/ubuntu/jni1/jni1-pocv1-backend/basyx.aasenvironment/basyx.aasenvironment.component/src/main/resources/aasenvironment.databridge/mock/mockHttpEmulatorServer.json,target=/data,readonly -p 2018:2018 mockoon/cli:latest --data data --port 2018`

\- Go to the project "jni1-pocv1-backend" and check .env file and set ENV and HOST and VERSION variables. example: `ENV=PROD HOST=[HOST] VERSION=1.0.0`

\- Run docker-compose-centralized.yml: `docker-compose -f docker-compose-centralized.yml up --build --remove-orphans -d`

\- To check logs, run: `docker-compose -f docker-compose-centralized.yml logs --follow`

\- To check all your images are up, run: `docker ps`

\- To restart an image from docker-compose-centralized.ym, run: `docker-compose -f docker-compose-centralized.yml restart [ServiceName]`

|Image|Internal port|Exposed port|Authentication|
| :- | :- | :- | :- |
|mongo:5.0.10|27017|27017|
|mongo-express:1.0.0-alpha.4|8081|8086|user:root mdp:password|
|eclipsebasyx/assgui:1.0.0|3001|80|keycloak irtsysx|
|eclipsebasyx/aasenvironment:1.0.0|8081|8081|
|eclipsebasyx/aas-registry-log-mongodb:1.0.0|8080|8080|
|eclipse-mosquitto:2.0.15|1884|1884|
|eclipsebasyx/databridge:1.0.0|8090|8090|

\- To remove docker-compose containers, run: `docker-compose -f docker-compose-centralized.yml down`



