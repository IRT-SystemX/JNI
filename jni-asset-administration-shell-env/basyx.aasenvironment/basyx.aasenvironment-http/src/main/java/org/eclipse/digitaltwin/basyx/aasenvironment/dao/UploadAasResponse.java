package org.eclipse.digitaltwin.basyx.aasenvironment.dao;

public class UploadAasResponse {

	private Boolean success;
	private String message;
	private String details;

	public UploadAasResponse(Boolean success, String message) {
		this.success = success;
		this.message = message;
	}

	public UploadAasResponse(Boolean success, String message, String details) {
		this(success, message);
		this.details = details;
	}

	public static UploadAasResponse buildErrorReponse(String message, String details) {
		return new UploadAasResponse(Boolean.FALSE, message, details);
	}

	public static UploadAasResponse buildSuccessReponse(String message) {
		return new UploadAasResponse(Boolean.TRUE, message);
	}

	public Boolean getSuccess() {
		return success;
	}

	public void setSuccess(Boolean success) {
		this.success = success;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getDetails() {
		return details;
	}

	public void setDetails(String details) {
		this.details = details;
	}

	@Override
	public String toString() {
		return "UploadAasFromFileResponse [success=" + success + ", message=" + message + ", details=" + details + "]";
	}

}
