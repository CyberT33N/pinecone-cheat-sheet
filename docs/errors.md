# Errors

Pinecone uses conventional HTTP response codes to indicate the success or failure of an API request. In general, codes in the `2xx` range indicate success, codes in the `4xx` range indicate an error that failed given the information provided, and codes in the `5xx` range indicate an error with Pinecone's servers.

## 200 - OK

The request succeeded.

## 201 - CREATED

The request succeeded and a new resource was created.

## 202 - NO CONTENT

The request succeeded, but there is no content to return.

## 400 - INVALID ARGUMENT

The request failed due to an invalid argument.

## 401 - UNAUTHENTICATED

The request failed due to a missing or invalid [API key](/guides/projects/understanding-projects#api-keys).

## 402 - PAYMENT REQUIRED

The request failed due to delinquent payment.

## 403 - FORBIDDEN

The request failed due to an exceeded [quota](/reference/api/database-limits#object-limits) or [index deletion protection](/guides/manage-data/manage-indexes#configure-deletion-protection).

## 404 - NOT FOUND

The request failed because the resource was not found.

## 409 - ALREADY EXISTS

The request failed because the resource already exists.

## 412 - FAILED PRECONDITIONS

The request failed due to preconditions not being met. |

## 422 - UNPROCESSABLE ENTITY

The request failed because the server was unable to process the contained instructions.

## 429 - TOO MANY REQUESTS

The request was [rate-limited](/reference/api/database-limits#rate-limits).

## 500 - UNKNOWN

An internal server error occurred.

## 503 - UNAVAILABLE

The server is currently unavailable.
