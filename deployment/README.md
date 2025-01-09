# Helm chart for JNI1 POC

- Current Chart version: **0.1.0**
- Current appVersion is: **1.0.0**

## Secrets
Mongodb and mqtt secrets must be created before this chart deployment. See the [values.yaml](./values.yaml) file.

You may use the `create_secret.sh` file to create secrets to the cluster.

## Docker images
The eclipsebasyx images are adapted for the JNI1 POC: such images are built in the JNI1 POC ci/cd, and stored in the private IRT-SystemX registry.

The ${VERSION} points to the current images tags in the docker-compose.yaml file: it is configured in the Helm chart in the [Chart.yaml](./Chart.yaml) `appVersion` field.

## ConfigMaps
The java `application.properties` files are created using a [configmap template](./templates/configMap.yaml) (default values).

**N.B.**: Regarding the mongodb uri: db host, name, username, password and kubernetes service address are all passed using environment vars and set in each `application.properties` (password from k8s **secret**):

```yaml
spring:
  data:
    mongodb:
      database: ${MONGODB_DB}
      uri: mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@{{ .Release.Name }}-mongodb.{{ .Release.Namespace }}.svc.cluster.local:{{ .Values.mongodb.service.port }}/${MONGODB_DB}?authSource=admin
```

### Update ConfigMaps
To update the `application.properties` files, you may update a copy of `values.yaml`:

```yaml
# [...]

# Example of application.properties config
config:
  # Application properties file -> template configMap.yaml
  aasregistryApplication: |
    server.port=8081
    spring.application.name=AAS Environment
    spring.servlet.multipart.max-file-size=10MB
    spring.servlet.multipart.max-request-size=10MB
  aasenvironmentApplication:
  applicationLogEvents:
# [...]
```

## Note on databridge Volume
In the docker-compose.yml global file from which this chart is deriving, 4 volumes with extra config files may be used in the `databridge` service.

These files correspond to use cases and are to be modified regularly.

A CI/CD job `load-databridge-conf` is added to the `.gitlab-ci.yml` [file](https://git.irt-systemx.fr/jni1/wp4/jni1-pocv1-backend/.gitlab-ci.yml), to update the files with **to be defined** ci rules.

## Note on url
All _localhost_ and _host.internal.docker_ urls must be adapted for the kubernetes cluster environment. All services are linked to their own **ingresses**, to be able for developers to easily configure the databridge configs.


## Databridge httpconsumer mock
In the `httpconsumer.json` file (databridge configs) is set an host listening on port 2018. The JNI1 wiki states:

```
- You need also to start an http server (mock) on port 2018 (used by the dataBridge component): A docker image “mockoon/cli:latest” is installed and uses the mock json data under /home/ubuntu/jni1/jni1-pocv1-backend/basyx.aasenvironment/basyx.aasenvironment.component/src/main/resources/aasenvironment.databridge/mock/mockHttpEmulatorServer.json.
The mock is accessible throught this link: http://[HOST]:2018

#### Start docker images using docker-compose

- Run the mock server: docker run -d --mount type=bind,source=/home/ubuntu/jni1/jni1-pocv1-backend/basyx.aasenvironment/basyx.aasenvironment.component/src/main/resources/aasenvironment.databridge/mock/mockHttpEmulatorServer.json,target=/data,readonly -p 2018:2018 mockoon/cli:latest --data data --port 2018
- Go to the project "jni1-pocv1-backend" and check .env file and set ENV and HOST and VERSION variables. example: ENV=PROD HOST=[HOST] VERSION=1.0.0
```

The httpconsumer url will be a well identified IP or FQDN, depending on the use case.


# Install Chart
You may install this chart from this repo:

```sh
helm upgrade -i jni1-poc . -f values.dev.yaml --wait --timeout=5m --atomic --debug -n jni1-dev
```
