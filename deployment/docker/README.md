# Deployment instruction for JNI plateform 

## For local dev 

1. Pull the necessary repositories:
- https://git.irt-systemx.fr/jni1/wp4/jni1-workflow
- https://git.irt-systemx.fr/jni1/wp4/jni1-poc-v2-frontend.git

The directory structure should be the following: 
- `jni1-workflow`
- `jni1-poc-v2-frontend`
- `deployment`

2. Inside the `deployment` directory, use `.env.example` as a template to create your own `.env` file.

3. Build the images using docker compose:

`docker compose up -d --build`

## For remote deployment

This deployment is based on docker compose and use docker engine as a base to run all components. 
The instructions are valid for a linux based environment (including WSL). 
1. https://docs.docker.com/engine/install/ubuntu/ 
2. https://docs.docker.com/engine/install/linux-postinstall/

Two option are given for deploying the plateforme depending on the need and access : 
-- Use pre-build container from harbor
-- Build the containers

> Most command will need to be ran using sudo

### Building the containers
#### Pulling the necessary projects
1. Pull all necessary projects for the plateform :
- https://git.irt-systemx.fr/jni1/wp4/jni1-pocv1-backend
- https://git.irt-systemx.fr/jni1/wp4/jni1-poc-v1-data-bridge
- https://git.irt-systemx.fr/jni1/wp4/jni1-pocv1-frontend

Optionnal components :
- https://git.irt-systemx.fr/jni1/wp4/jni1-workflow-manager
- https://git.irt-systemx.fr/jni1/wp4/jni1-workflow


#### Building AAS components

In order to build the different components the following tools need to be installed :
- jdk 11 & maven:
    1. `apt update`
    2. `apt install default-jdk`
    3. `export JAVA\_HOME=/usr/lib/jvm/java-11-openjdk-amd64`
    4. `export PATH=$PATH:$JAVA\_HOME/bin`
    5. `apt install maven`

- node:
> Using the Node Version Manager is recommended : https://github.com/nvm-sh/nvm
    1. `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash`

To prepare the build environment, **from the backend folder jni1-pocv1-backend** launch all supporting tooling :
`docker compose up –-build –-remove-orphans`

Install and testing :
`mvn clean install`

Post-install, turn off the build environment :
`docker compose down`

##### Building AASEnvironment container:
> Here for version 1.0.0, change accordingly
1. `cd basyx.aasenvironment/basyx.aasenvironment.component`
2. `docker build -t eclipsebasyx/aasenvironment:1.0.0 .`
> This create eclipsebasyx/aasenvironment:1.0.0 

##### Building AAS Registry container:
1. `cd ../../basyx.aasregistry/basyx.aasregistry-service-release-log-mongodb`
2. `mvn clean install -DskipTests -Pdockerbuild`
> This create eclipsebasyx/aas-registry-log-mongodb:1.0.0

##### Building DataBridge container
**From the databridge folder : jni1-poc-v1-data-bridge**

1. `mvn clean install`
2. `cd databridge.component`
3. `mvn install -DskipTests -Pdocker`
> This create eclipsebasyx/databridge:1.0.0

##### Building AAS frontend
**From the frondend folder : jni1-pocv1-frontend**
`docker build -t aas-web-ui_v2:1.0.0 .`
> This create aas-web-ui_v2:1.0.0


#### Building WorkFlow Manager components
##### Workflow manager environnement
**From the WorkFlow Manager folder : jni1-workflow**
> :warning: In order to work properly the server IP will need to be configured. Otherwise access to the workflow model manager will not be possible.
1. Update the .env file located in /ui/ with the server IP adresses
2. build the docker `docker build -t workflow-manager:1.0.0 .`
>  This create workflow-manager:1.0.0

##### Workflow models manager
**From the WorkFlow models Manager folder : jni1-workflow-manager**
`docker build -t workflow-model-manager:1.0.0 .`
> This create workflow-model-manager:1.0.0