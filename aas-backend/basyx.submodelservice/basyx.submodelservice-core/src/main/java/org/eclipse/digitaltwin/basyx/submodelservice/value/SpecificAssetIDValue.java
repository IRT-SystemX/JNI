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


package org.eclipse.digitaltwin.basyx.submodelservice.value;

import org.eclipse.digitaltwin.aas4j.v3.model.Reference;
import org.eclipse.digitaltwin.aas4j.v3.model.SpecificAssetID;
import org.eclipse.digitaltwin.aas4j.v3.model.impl.DefaultSpecificAssetID;

/**
 * Represents the {@link SpecificAssetId} value
 * 
 * @author danish
 *
 */
public class SpecificAssetIDValue {
	
	private String name;
	private String value;
	private ReferenceValue externalSubjectId;
	
	@SuppressWarnings("unused")
	private SpecificAssetIDValue() {
		super();
	}

	public SpecificAssetIDValue(String name, String value, ReferenceValue externalSubjectId) {
		this.name = name;
		this.value = value;
		this.externalSubjectId = externalSubjectId;
	}

	public SpecificAssetIDValue(SpecificAssetID specificAssetID) {
		this.name = specificAssetID.getName();
		this.value = specificAssetID.getValue();
		if (specificAssetID.getExternalSubjectID() != null) {
			this.externalSubjectId = new ReferenceValue(specificAssetID.getExternalSubjectID());
		}
	}

	public String getName() {
		return name;
	}

	public String getValue() {
		return value;
	}

	public Reference getExternalSubjectId() {
		if (externalSubjectId == null)
			return null;
		
		return externalSubjectId.toReference();
	}

	public SpecificAssetID toSpecificAssetID() {
		return new DefaultSpecificAssetID.Builder().externalSubjectID(getExternalSubjectId()).name(getName()).value(getValue()).build();
	}
}
