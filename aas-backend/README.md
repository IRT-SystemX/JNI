# JNI Platform with Eclipse BaSyx Java V2 Server SDK [![Docker Pulls](https://img.shields.io/docker/pulls/eclipsebasyx/aas-server?style=plastic)](https://hub.docker.com/search?q=eclipsebasyx)

In this repository, JNI Platform with the BaSyx Java V2 components fully compatible with *Details of the Asset Administration Shell V3* are contained. For each component, a multitude of backends (e.g., InMemory, MongoDB) as well as further features (MQTT, ...) are provided. All components are available on [DockerHub](https://hub.docker.com/search?q=eclipsebasyx) as off-the-shelf components and can be easily configured and extended. Additionally, the server SDK of this repository can be used for implementation of further components.

The following off-the-shelf components are available:

* [AAS Repository](basyx.aasrepository)
* [Submodel Repository](basyx.submodelrepository)
* [ConceptDescription Repository](basyx.conceptdescriptionrepository)
* [AAS Environment](basyx.aasenvironment)
* [AAS Registry](basyx.aasregistry)
* [Submodel Registry](basyx.submodelregistry)

## JNI Platform : docker-compose files
[docker-compose.yml](docker-compose.yml) file that illustrates the setup for the maven build and test project.

[docker-compose-centralized.yml](docker-compose-centralized.yml) file that contains all the docker images needed to run:
* [AAS Environment](basyx.aasenvironment).
* [AAS Registry](basyx.aasregistry)
* Front-end application (see project https://git.irt-systemx.fr/jni1/wp4/jni1-pocv1-frontend)
* DataBridge configuration used to integrate data sources within Asset Administration Shells (see project https://git.irt-systemx.fr/jni1/wp4/jni1-poc-v1-data-bridge).

You can find the dataBridge configuration folder (aasenvironment.databridge) under (basyx.aasenvironment/basyx.aasenvironment.component/src/main/resources).

We are providing `DEV` and `PROD` configs. To run the [docker-compose-centralized.yml](docker-compose-centralized.yml) file, you need to setup ${ENV} and ${HOST} environment variables first:
- 'ENV' variable contains the deploiment mode (DEV or PROD)
- 'HOST' variable for setting the host name or ip address (localhost or another domain name or ip address)


## Examples
We are providing easy to use [examples](examples) that can be leveraged for setting up your own AAS infrastructure.

## Contributing

If you would like to contribute, please notice the [contribution guidelines](CONTRIBUTING.md). The overall process is described in the [Eclipse wiki](https://wiki.eclipse.org/BaSyx_/_Developer_/_Contributing).
