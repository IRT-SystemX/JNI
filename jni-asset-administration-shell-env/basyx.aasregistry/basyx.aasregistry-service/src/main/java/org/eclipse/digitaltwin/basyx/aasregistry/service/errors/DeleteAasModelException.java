package org.eclipse.digitaltwin.basyx.aasregistry.service.errors;

@SuppressWarnings("serial")
public class DeleteAasModelException extends RuntimeException {

	public DeleteAasModelException() {
	}

	public DeleteAasModelException(String exceptionMsg, String elementId) {
		super(getMsg(exceptionMsg, elementId));
	}

	private static String getMsg(String exceptionMsg, String elementId) {
		return "Error while deleting aas model data on element : " + elementId + " . Error message : " + exceptionMsg;
	}
}
