package org.eclipse.digitaltwin.basyx.http;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpClient.Version;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

import org.eclipse.digitaltwin.aas4j.v3.model.AssetAdministrationShell;
import org.eclipse.digitaltwin.basyx.aasregistry.model.AssetAdministrationShellDescriptor;
import org.eclipse.digitaltwin.basyx.aasregistry.model.Endpoint;
import org.eclipse.digitaltwin.basyx.aasregistry.model.ProtocolInformation;
import org.eclipse.digitaltwin.basyx.core.exceptions.RegistryRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class RegistryHttpClient {

	private final HttpClient HTTP_CLIENT = HttpClient.newBuilder().version(Version.HTTP_2).build();
	private final String PROTOCOL_VERSION = "1.1";

	@Value("${aasregistry.server.url:}")
	private String aasRegistryServerUrl;

	@Value("${aas.server.url:}")
	private String aasServerUrl;

	private static Logger logger = LoggerFactory.getLogger(RegistryHttpClient.class);

	public void addAssToRegistry(AssetAdministrationShell aas) {
		try {
			AssetAdministrationShellDescriptor aasDescriptor = buildAasRegistryFromAas(aas);
			String inputJson = covertFromObjectToJson(aasDescriptor);
			HttpRequest request = HttpRequest.newBuilder(URI.create(aasRegistryServerUrl + "/shell-descriptors"))
					.header("Content-Type", "application/json").POST(HttpRequest.BodyPublishers.ofString(inputJson))
					.build();
			HttpResponse<String> registryResponse = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
			if (registryResponse != null && registryResponse.statusCode() != HttpStatus.CREATED.value()) {
				throw new Exception("Registry Response with status code = " + registryResponse.statusCode()
						+ " and Response body = " + registryResponse.body());
			}
			logger.info("Aas added to Registry Server");
		} catch (Exception e) {
			logger.error("Error while adding Aas To Registry Server", e);
			throw new RegistryRequestException(e.getMessage(), aas.getId());
		}

	}

	private AssetAdministrationShellDescriptor buildAasRegistryFromAas(AssetAdministrationShell aas) {
		AssetAdministrationShellDescriptor aasDescriptor = new AssetAdministrationShellDescriptor(aas.getId());
		aasDescriptor.setIdShort(aas.getIdShort());
		aasDescriptor.setEndpoints(buildAasRegistryEndpoints(buildProtocolInformation()));
		return aasDescriptor;
	}

	private ProtocolInformation buildProtocolInformation() {
		ProtocolInformation protocolInformation = new ProtocolInformation(aasServerUrl);
		protocolInformation.setEndpointProtocolVersion(List.of(PROTOCOL_VERSION));
		return protocolInformation;
	}

	private List<Endpoint> buildAasRegistryEndpoints(ProtocolInformation protocolInformation) {
		List<Endpoint> endpoints = new ArrayList<>();
		Endpoint endpoint = new Endpoint("AAS-1.0", protocolInformation);
		endpoints.add(endpoint);
		return endpoints;
	}

	private String covertFromObjectToJson(Object obj) throws JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		mapper.setVisibility(PropertyAccessor.FIELD, Visibility.ANY);
		return mapper.writeValueAsString(obj);
	}

}
