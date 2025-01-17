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

import java.util.List;

import javax.validation.Valid;

import org.eclipse.digitaltwin.basyx.aasenvironment.dao.UploadAasResponse;
import org.eclipse.digitaltwin.basyx.http.Base64UrlEncodedIdentifier;
import org.eclipse.digitaltwin.basyx.http.model.Result;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2023-05-08T12:36:05.278579031Z[GMT]")
@Validated
public interface AASEnvironmentHTTPApi {
	@Operation(summary = "Returns an appropriate serialization based on the specified format (see SerializationFormat)", description = "", tags = { "Environment API" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Requested serialization based on SerializationFormat", content = @Content(mediaType = "application/asset-administration-shell-package+xml", schema = @Schema(implementation = Resource.class))),
        
        @ApiResponse(responseCode = "400", description = "Bad Request, e.g. the request parameters of the format of the request body is wrong.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Result.class))),
        
        @ApiResponse(responseCode = "401", description = "Unauthorized, e.g. the server refused the authorization attempt.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Result.class))),
        
        @ApiResponse(responseCode = "403", description = "Forbidden", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Result.class))),
        
        @ApiResponse(responseCode = "404", description = "Not Found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Result.class))),
        
        @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Result.class))),
        
        @ApiResponse(responseCode = "200", description = "Default error handling for unmentioned status codes", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Result.class))) })
    @RequestMapping(value = "/serialization",
        produces = { "application/asset-administration-shell-package+xml", "application/json", "application/xml" }, 
        method = RequestMethod.GET)
    ResponseEntity<Resource> generateSerializationByIds(@Parameter(in = ParameterIn.QUERY, description = "The Asset Administration Shells' unique ids (UTF8-BASE64-URL-encoded)" ,schema=@Schema()) @Valid @RequestParam(value = "aasIds", required = false) List<String> aasIds, @Parameter(in = ParameterIn.QUERY, description = "The Submodels' unique ids (UTF8-BASE64-URL-encoded)" ,schema=@Schema()) @Valid @RequestParam(value = "submodelIds", required = false) List<String> submodelIds, @Parameter(in = ParameterIn.QUERY, description = "Include Concept Descriptions?" ,schema=@Schema( defaultValue="true")) @Valid @RequestParam(value = "includeConceptDescriptions", required = false, defaultValue="true") Boolean includeConceptDescriptions);

	@Operation(summary = "Upload AAS environment (ass, submodels, concept description) from file (.aasx | .json | .xml)", description = "", tags = { "Environment API" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "AAS environment uploaded"),
        
        @ApiResponse(responseCode = "400", description = "Bad Request, e.g. the request parameters of the format of the request body is wrong."),
        
        @ApiResponse(responseCode = "404", description = "Not Found"),
        
        @ApiResponse(responseCode = "500", description = "Internal Server Error") })
    @RequestMapping(value = "/shells/aasx", method = RequestMethod.POST)
	ResponseEntity<UploadAasResponse> uploadAasFromFile(@RequestParam("file") MultipartFile file);
	
	
	@Operation(summary = "Deletes an Asset Administration Shell", description = "", tags = { "Environment API" })
	@ApiResponses(value = { @ApiResponse(responseCode = "204", description = "Asset Administration Shell deleted successfully"),
			@ApiResponse(responseCode = "404", description = "Not Found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Result.class))),

			@ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Result.class)))})
	@RequestMapping(value = "/shells/delete-environment/{aasIdentifier}", produces = { "application/json" }, method = RequestMethod.DELETE)
	ResponseEntity<Void> deleteAasEnvironment(
			@Parameter(in = ParameterIn.PATH, description = "The Asset Administration Shell’s unique id (UTF8-BASE64-URL-encoded)", required = true, schema = @Schema()) @PathVariable("aasIdentifier") Base64UrlEncodedIdentifier aasIdentifier);
}
