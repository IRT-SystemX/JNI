package org.eclipse.digitaltwin.basyx.core.exceptions;

@SuppressWarnings("serial")
public class RegistryRequestException extends RuntimeException {
	public RegistryRequestException() {
	}

	public RegistryRequestException(String exceptionMsg, String elementId) {
		super(getMsg(exceptionMsg, elementId));
	}

	private static String getMsg(String exceptionMsg, String elementId) {
		return "Error while registry request with element : " + elementId + " . Error message : " + exceptionMsg;
	}
}
