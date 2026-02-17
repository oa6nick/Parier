# MediaApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**mediaIdDownloadGet**](#mediaiddownloadget) | **GET** /media/{id}/download | Download file|
|[**mediaIdPost**](#mediaidpost) | **POST** /media/{id} | Get media info|
|[**mediaIdRawGet**](#mediaidrawget) | **GET** /media/{id}/raw | Raw file|

# **mediaIdDownloadGet**
> File mediaIdDownloadGet()

Download a file from S3 storage

### Example

```typescript
import {
    MediaApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MediaApi(configuration);

let id: string; //Media ID (default to undefined)

const { status, data } = await apiInstance.mediaIdDownloadGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Media ID | defaults to undefined|


### Return type

**File**

### Authorization

[OAuth2Keycloak](../README.md#OAuth2Keycloak), [BasicAuth](../README.md#BasicAuth), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/octet-stream


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mediaIdPost**
> InternalHandlersMediaResponse mediaIdPost(request)

Get media file information

### Example

```typescript
import {
    MediaApi,
    Configuration,
    ParierServerInternalModelsDefaultRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new MediaApi(configuration);

let id: string; //Media ID (default to undefined)
let request: ParierServerInternalModelsDefaultRequest; //Get media parameters

const { status, data } = await apiInstance.mediaIdPost(
    id,
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **ParierServerInternalModelsDefaultRequest**| Get media parameters | |
| **id** | [**string**] | Media ID | defaults to undefined|


### Return type

**InternalHandlersMediaResponse**

### Authorization

[OAuth2Keycloak](../README.md#OAuth2Keycloak), [BasicAuth](../README.md#BasicAuth), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mediaIdRawGet**
> File mediaIdRawGet()

Raw a file from S3 storage

### Example

```typescript
import {
    MediaApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MediaApi(configuration);

let id: string; //Media ID (default to undefined)

const { status, data } = await apiInstance.mediaIdRawGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Media ID | defaults to undefined|


### Return type

**File**

### Authorization

[OAuth2Keycloak](../README.md#OAuth2Keycloak), [BasicAuth](../README.md#BasicAuth), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/octet-stream


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

