# JNI Platform

<p align="center">
<img src=https://github.com/IRT-SystemX/JNI/raw/main/img/logo/jni-logo.png width="450" align="center">
</p>


The digital twin platform is a set of integrated services, applications, that are designed to be used to implement industrial digital twins. 

The JNI Platform that launched as part of the [JNI programme](https://www.irt-systemx.fr/en/research-programs/digital-twins-for-complex-industrial-systems/) of IRT SYSTEMX.
JNI Platform based on BaSyx Java V2 components fully compatible with the *Asset Administration Shell* v3. For each component, a multitude of backends (e.g., InMemory, MongoDB) as well as further features (MQTT, ...) are provided. 

The following off-the-shelf components are available:

* [JNI Portal](jni-portal)
* [JNI Asset Administration Shell Env](jni-asset-administration-shell-env)
* [JNI Data Bridge](jni-data-bridge)
* [JNI Deployment](jni-deployment)
* [JNI Scenario Manager](jni-scenario-manager)
* [JNI Scenario Manager - Model Library](jni-scenario-manager-model-library)


## Deployment using `docker compose` 
[docker-compose.yml](jni-deployment/docker/docker-compose.yml) configuration file contains all the docker images needed to deploy JNI Platform in its centralized architecture (see below).

> **Atention**: To allow clients and other services to access BaSyx from outside your network, you must set the environment variable `basys.externalurl` to your service's PUBLIC ADDRESS in the configuration file `jni-deployment/docker/jni/aas-env.properties`.

```
cd jni-deployment/docker
docker compose up -d --build
```

## Wiki
This projects contains a complete [wiki](https://github.com/IRT-SystemX/JNI/wiki) where further information about the architecture, datamodel, usage can be found, as well as build instructions.



