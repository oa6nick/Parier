# AuthApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authLoginCodePut**](#authlogincodeput) | **PUT** /auth/login-code | Login via Keycloak|
|[**authLogoutPut**](#authlogoutput) | **PUT** /auth/logout | Logout user|
|[**authProfilePost**](#authprofilepost) | **POST** /auth/profile | Get current user profile|

# **authLoginCodePut**
> InternalHandlersProfileResponse authLoginCodePut(credentials)

Authenticate user through Keycloak and return tokens

### Example

```typescript
import {
    AuthApi,
    Configuration,
    InternalHandlersLoginCodeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let credentials: InternalHandlersLoginCodeRequest; //Login credentials

const { status, data } = await apiInstance.authLoginCodePut(
    credentials
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **credentials** | **InternalHandlersLoginCodeRequest**| Login credentials | |


### Return type

**InternalHandlersProfileResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authLogoutPut**
> ParierServerInternalModelsSuccessResponse authLogoutPut(request)

Logout user from Keycloak

### Example

```typescript
import {
    AuthApi,
    Configuration,
    InternalHandlersKeycloakLogoutRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let request: InternalHandlersKeycloakLogoutRequest; //Logout parameters

const { status, data } = await apiInstance.authLogoutPut(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **InternalHandlersKeycloakLogoutRequest**| Logout parameters | |


### Return type

**ParierServerInternalModelsSuccessResponse**

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
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authProfilePost**
> InternalHandlersProfileResponse authProfilePost(request)

Get current user profile information from Keycloak

### Example

```typescript
import {
    AuthApi,
    Configuration,
    ParierServerInternalModelsDefaultRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let request: ParierServerInternalModelsDefaultRequest; //Profile parameters

const { status, data } = await apiInstance.authProfilePost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **ParierServerInternalModelsDefaultRequest**| Profile parameters | |


### Return type

**InternalHandlersProfileResponse**

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
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

