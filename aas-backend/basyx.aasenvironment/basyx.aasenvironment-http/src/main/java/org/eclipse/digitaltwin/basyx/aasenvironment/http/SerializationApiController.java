/*******************************************************************************
 * Copyright (C) 2023 the Eclipse BaSyx Authors
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * SPDX-License-Identifier: MIT
 ******************************************************************************/

package org.eclipse.digitaltwin.basyx.aasenvironment.http;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.eclipse.digitaltwin.aas4j.v3.dataformat.SerializationException;
import org.eclipse.digitaltwin.aas4j.v3.model.AssetAdministrationShell;
import org.eclipse.digitaltwin.aas4j.v3.model.Environment;
import org.eclipse.digitaltwin.aas4j.v3.model.Key;
import org.eclipse.digitaltwin.aas4j.v3.model.KeyTypes;
import org.eclipse.digitaltwin.aas4j.v3.model.Reference;
import org.eclipse.digitaltwin.basyx.aasenvironment.AasEnvironmentSerialization;
import org.eclipse.digitaltwin.basyx.aasenvironment.dao.UploadAasResponse;
import org.eclipse.digitaltwin.basyx.aasenvironment.preconfiguration.AasEnvironmentPreconfigurationLoader;
import org.eclipse.digitaltwin.basyx.aasrepository.AasRepository;
import org.eclipse.digitaltwin.basyx.conceptdescriptionrepository.ConceptDescriptionRepository;
import org.eclipse.digitaltwin.basyx.core.exceptions.ElementDoesNotExistException;
import org.eclipse.digitaltwin.basyx.core.pagination.CursorResult;
import org.eclipse.digitaltwin.basyx.core.pagination.PaginationInfo;
import org.eclipse.digitaltwin.basyx.http.Base64UrlEncodedIdentifier;
import org.eclipse.digitaltwin.basyx.submodelrepository.SubmodelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2023-05-08T12:36:05.278579031Z[GMT]")
@RestController
public class SerializationApiController implements AASEnvironmentHTTPApi {
	private static final String ACCEPT_JSON = "application/json";
	private static final String ACCEPT_XML = "application/xml";
	private static final String ACCEPT_AASX = "application/asset-administration-shell-package+xml";

	private final HttpServletRequest request;

	private final AasEnvironmentSerialization aasEnvironment;

	private AasRepository repository;

	private SubmodelRepository submodelRepository;

	private ConceptDescriptionRepository conceptDescriptionRepository;

	private AasEnvironmentPreconfigurationLoader aasEnvironmentPreconfigurationLoader;

	@Autowired
	public SerializationApiController(HttpServletRequest request, AasEnvironmentSerialization aasEnvironment,
			AasRepository repository, SubmodelRepository submodelRepository,
			ConceptDescriptionRepository conceptDescriptionRepository,
			AasEnvironmentPreconfigurationLoader aasEnvironmentPreconfigurationLoader) {
		this.request = request;
		this.aasEnvironment = aasEnvironment;
		this.repository = repository;
		this.submodelRepository = submodelRepository;
		this.conceptDescriptionRepository = conceptDescriptionRepository;
		this.aasEnvironmentPreconfigurationLoader = aasEnvironmentPreconfigurationLoader;
	}

	@Override
	public ResponseEntity<Resource> generateSerializationByIds(
			@Parameter(in = ParameterIn.QUERY, description = "The Asset Administration Shells' unique ids (UTF8-BASE64-URL-encoded)", schema = @Schema()) @Valid @RequestParam(value = "aasIds", required = false) List<String> aasIds,
			@Parameter(in = ParameterIn.QUERY, description = "The Submodels' unique ids (UTF8-BASE64-URL-encoded)", schema = @Schema()) @Valid @RequestParam(value = "submodelIds", required = false) List<String> submodelIds,
			@Parameter(in = ParameterIn.QUERY, description = "Include Concept Descriptions?", schema = @Schema(defaultValue = "true")) @Valid @RequestParam(value = "includeConceptDescriptions", required = false, defaultValue = "true") Boolean includeConceptDescriptions) {
		String accept = request.getHeader("Accept");

		if (!areParametersValid(accept, aasIds, submodelIds))
			return new ResponseEntity<Resource>(HttpStatus.BAD_REQUEST);

		try {
			if (accept.equals(ACCEPT_AASX)) {
				byte[] serialization = aasEnvironment.createAASXAASEnvironmentSerialization(getOriginalIds(aasIds),
						getOriginalIds(submodelIds), includeConceptDescriptions);
				return new ResponseEntity<Resource>(new ByteArrayResource(serialization), HttpStatus.OK);
			}

			if (accept.equals(ACCEPT_XML)) {
				String serialization = aasEnvironment.createXMLAASEnvironmentSerialization(getOriginalIds(aasIds),
						getOriginalIds(submodelIds), includeConceptDescriptions);
				return new ResponseEntity<Resource>(new ByteArrayResource(serialization.getBytes()), HttpStatus.OK);
			}

			String serialization = aasEnvironment.createJSONAASEnvironmentSerialization(getOriginalIds(aasIds),
					getOriginalIds(submodelIds), includeConceptDescriptions);
			return new ResponseEntity<Resource>(new ByteArrayResource(serialization.getBytes()), HttpStatus.OK);
		} catch (ElementDoesNotExistException e) {
			return new ResponseEntity<Resource>(HttpStatus.NOT_FOUND);
		} catch (SerializationException | IOException e) {
			return new ResponseEntity<Resource>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	private List<String> getOriginalIds(List<String> ids) {
		List<String> results = new ArrayList<>();
		ids.forEach(id -> {
			results.add(Base64UrlEncodedIdentifier.fromEncodedValue(id).getIdentifier());
		});
		return results;
	}

	private boolean areParametersValid(String accept, @Valid List<String> aasIds, @Valid List<String> submodelIds) {
		if (aasIds.isEmpty() || submodelIds.isEmpty())
			return false;
		return (accept.equals(ACCEPT_AASX) || accept.equals(ACCEPT_JSON) || accept.equals(ACCEPT_XML));
	}

	@Override
	public ResponseEntity<UploadAasResponse> uploadAasFromFile(@RequestParam("file") MultipartFile file) {
		if (file.isEmpty()) {
			return new ResponseEntity<UploadAasResponse>(UploadAasResponse.buildErrorReponse(
					"Error while upload AAS From File", "File should not be empty!"), HttpStatus.BAD_REQUEST);
		}
		try {
			addAasFromFile(file);
			return new ResponseEntity<UploadAasResponse>(UploadAasResponse.buildSuccessReponse("AAS File uploaded"),
					HttpStatus.CREATED);
		} catch (Exception ex) {
			return new ResponseEntity<UploadAasResponse>(
					UploadAasResponse.buildErrorReponse("Error while upload AAS From File", ex.getMessage()),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	private void addAasFromFile(MultipartFile file) throws Exception {
		try (InputStream inputStream = file.getInputStream()) {
			Environment environment = aasEnvironmentPreconfigurationLoader
					.getEnvironmentFromInputStream(file.getOriginalFilename(), inputStream);
			if (isEnvironmentLoaded(environment)) {
				aasEnvironmentPreconfigurationLoader.loadEnvironmentFromFile(repository, submodelRepository,
						conceptDescriptionRepository, environment);
			}
		}
	}

	private boolean isEnvironmentLoaded(Environment environment) {
		return environment != null;
	}

	@Override
	public ResponseEntity<Void> deleteAasEnvironment(
			@Parameter(in = ParameterIn.PATH, description = "The Asset Administration Shell’s unique id (UTF8-BASE64-URL-encoded)", required = true, schema = @Schema()) @PathVariable("aasIdentifier") Base64UrlEncodedIdentifier aasIdentifier) {
		
		aasEnvironmentPreconfigurationLoader.deleteAasEnvironment(repository, submodelRepository, aasIdentifier.getIdentifier());
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
}
