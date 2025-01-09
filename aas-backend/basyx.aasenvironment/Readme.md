# Eclipse BaSyx - AAS Environment
Eclipse BaSyx provides the AAS Environment as off-the-shelf component:

    docker run --name=aas-env -p:8081:8081 -v C:/tmp/application.properties:/application/application.properties eclipsebasyx/aasenvironment:2.0.0-SNAPSHOT 

> *Disclaimer*: In this example, configuration files are located in `C:/tmp`

> *Disclaimer*: The binding of volume `C:/tmp/application.properties` to `/application/application.properties` is tested using Windows Powershell. Other terminals might run into an error.

It aggregates the AAS Repository, Submodel Repository and ConceptDescription Repository into a single component. For its features and configuration, see the documentation of the respective components.

In addition, it supports the following endpoint defined in DotAAS Part 2 V3 - Serialization Interface:
- GenerateSerializationByIds

The Aggregated API endpoint documentation is available at:

	http://{host}:{port}/v3/api-docs
	
The Aggregated Swagger UI for the endpoint is available at:

	http://{host}:{port}/swagger-ui/index.html

For a configuration example, see [application.properties](./basyx.aasenvironment.component/src/main/resources/application.properties)
The Health Endpoint and CORS Documentation can be found [here](../docs/Readme.md). 

# Build Resources

To build the images run these commands from this folder or for the parent project pom:

Install maven generate jars:

``` shell 
mvn clean install
```

## Create docker image of AAS Environments
The docker file exists under ./basyx.aasenvironment.component. To build the docker file run:

	docker build -t eclipsebasyx/aasenvironment:2.0.0-SNAPSHOT .

## Preconfiguration of AAS Environments
The AAS Environment Component supports the preconfiguration of AAS Environments (e.g., XML, JSON, AASX) via the _basyx.environment_ parameter. 

The feature supports both preconfiguring explicit files (e.g., file:myDevice.aasx) as well as directories (e.g., file:myDirectory) that will be recursively scanned for serialized environments.

For examples, see [application.properties](./basyx.aasenvironment.component/src/main/resources/application.properties)

The AAS Environment Component supports also the upload of AAS Environments (e.g., XML, JSON, AASX) via API endpoint [/upload] (see Swagger UI documentation).

## Performance Tests configuration
The AAS Environment Component contains some performance tests under `./basyx.aasenvironment.component/src/test/resources/testPerformance`.

Download [Jmeter Apache server Tool](https://jmeter.apache.org) to run the .jmx file.

Note: Download and Add the JARs [jmeter functions](https://jmeter-plugins.org/?search=jpgc-functions) under the server after the installation to enable some funtions used in the test configuration

The performance test is configured to run multiple selected scenarios:

•	Scenario A:
- For 1 networked AAS* with 10 submodel for each AAS instance
- For 1 networked AAS* with 1000 submodel for each AAS instance
	
•	Scenario B: 
- For 100 networked AAS* with 10 submodel for each of the 100 AAS instance
- For 100 networked AAS* with 1000 submodel for each of the 100 AAS instance

PS: Update the request max upload size in the [application.properties](./basyx.aasenvironment.component/src/main/resources/application.properties) file to work with the last scenario with 100 AAS and 1000 SM for each. The default max upload size value is 1Mo. To increment the default value from 1Mo to 10Mo, please add this config:

	spring.servlet.multipart.max-file-size=10MB
	spring.servlet.multipart.max-request-size=10MB

*Each AAS instance is holding 1 or several submodels, where each submodel is holding one property (such as temperature value from a sensor).


To avoid fluctuation, each measure will is configured 10 times. Each test scenario follows the logic defined below:
1.	Creating/import AAS model: Request POST upload AAS file.
2.	Check uploaded AAS in registry: Request GET AAS from Registry.
3.	Read submodel property (for instance temperature): Request GET submodel value.
4.	Update property value into the same submodel as in step 2: Request PATCH submodel value.
5.	Read the new defined propert: Request GET submodel value.
6.	Delete existing AAS mode: Request DELETE AAS from Registry (with parameter includeAasEnvironment=true)

The folders SC_[X] under `/src/test/resources/testPerformance` contains the test results and the AAS json file used for each test scenario.

Use the main function [AasEnvironmentGenerateTestPerf.java](./basyx.aasenvironment.component/src/test/java/basyx/aasenvironment/component/AasEnvironmentGenerateTestPerf.java) to generation AAS and SM for tests. The parameters NB_AAS, NB_SM, FILE_PATH and FILE_Name allows to generate AAS json files for test:

	//Total Number AAS to generate
	private static int NB_AAS = 1;
	
	//Number of Submodels to generate for each AAS
	private static int NB_SM = 10;
		
	//Generated AAS json file path
	private static String FILE_PATH = "C:/Users/mohamed-firas.barrak/Desktop/testPerf/SC_A1";
			
	//Generated AAS json file Name
	private static String FILE_NAME = "AAS_SC_A1.json";

After generating the AAS json file for test, you need to update the Submodel element with id "https://example.com/ids/aas/1/sm/1" by the Temperature submodel element in [SM_temperature.json](basyx.aasenvironment.component\src\test\resources\testPerformance\SM_temperature.json) file.

PS: update only the submodel element in submodels array, not the submodel reference in the assetAdministrationShells array.

