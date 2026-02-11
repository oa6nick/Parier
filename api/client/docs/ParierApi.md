# ParierApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**parierBetPost**](#parierbetpost) | **POST** /parier/bet | Get bets|
|[**parierBetPut**](#parierbetput) | **PUT** /parier/bet | Create bet|
|[**parierBetStatusesPost**](#parierbetstatusespost) | **POST** /parier/bet-statuses | Get bet statuses|
|[**parierBetTypesPost**](#parierbettypespost) | **POST** /parier/bet-types | Get bet types|
|[**parierCategoriesPost**](#pariercategoriespost) | **POST** /parier/categories | Get categories|
|[**parierLikeTypesPost**](#parierliketypespost) | **POST** /parier/like-types | Get like types|
|[**parierVerificationSourcesPost**](#parierverificationsourcespost) | **POST** /parier/verification-sources | Get verification sources|

# **parierBetPost**
> InternalHandlersBetResponse parierBetPost(request)

Get bets

### Example

```typescript
import {
    ParierApi,
    Configuration,
    ParierServerInternalModelsBetRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ParierApi(configuration);

let request: ParierServerInternalModelsBetRequest; //Request

const { status, data } = await apiInstance.parierBetPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **ParierServerInternalModelsBetRequest**| Request | |


### Return type

**InternalHandlersBetResponse**

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

# **parierBetPut**
> InternalHandlersBetCreateResponse parierBetPut(request)

Create bet

### Example

```typescript
import {
    ParierApi,
    Configuration,
    ParierServerInternalModelsBetCreateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ParierApi(configuration);

let request: ParierServerInternalModelsBetCreateRequest; //Request

const { status, data } = await apiInstance.parierBetPut(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **ParierServerInternalModelsBetCreateRequest**| Request | |


### Return type

**InternalHandlersBetCreateResponse**

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

# **parierBetStatusesPost**
> InternalHandlersDictionaryResponse parierBetStatusesPost(request)

Get bet statuses

### Example

```typescript
import {
    ParierApi,
    Configuration,
    ParierServerInternalModelsDictionaryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ParierApi(configuration);

let request: ParierServerInternalModelsDictionaryRequest; //Request

const { status, data } = await apiInstance.parierBetStatusesPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **ParierServerInternalModelsDictionaryRequest**| Request | |


### Return type

**InternalHandlersDictionaryResponse**

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

# **parierBetTypesPost**
> InternalHandlersDictionaryResponse parierBetTypesPost(request)

Get bet types

### Example

```typescript
import {
    ParierApi,
    Configuration,
    ParierServerInternalModelsDictionaryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ParierApi(configuration);

let request: ParierServerInternalModelsDictionaryRequest; //Request

const { status, data } = await apiInstance.parierBetTypesPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **ParierServerInternalModelsDictionaryRequest**| Request | |


### Return type

**InternalHandlersDictionaryResponse**

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

# **parierCategoriesPost**
> InternalHandlersDictionaryResponse parierCategoriesPost(request)

Get categories

### Example

```typescript
import {
    ParierApi,
    Configuration,
    ParierServerInternalModelsDictionaryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ParierApi(configuration);

let request: ParierServerInternalModelsDictionaryRequest; //Request

const { status, data } = await apiInstance.parierCategoriesPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **ParierServerInternalModelsDictionaryRequest**| Request | |


### Return type

**InternalHandlersDictionaryResponse**

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

# **parierLikeTypesPost**
> InternalHandlersDictionaryResponse parierLikeTypesPost(request)

Get like types

### Example

```typescript
import {
    ParierApi,
    Configuration,
    ParierServerInternalModelsDictionaryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ParierApi(configuration);

let request: ParierServerInternalModelsDictionaryRequest; //Request

const { status, data } = await apiInstance.parierLikeTypesPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **ParierServerInternalModelsDictionaryRequest**| Request | |


### Return type

**InternalHandlersDictionaryResponse**

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

# **parierVerificationSourcesPost**
> InternalHandlersDictionaryResponse parierVerificationSourcesPost(request)

Get verification sources

### Example

```typescript
import {
    ParierApi,
    Configuration,
    ParierServerInternalModelsDictionaryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ParierApi(configuration);

let request: ParierServerInternalModelsDictionaryRequest; //Request

const { status, data } = await apiInstance.parierVerificationSourcesPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **ParierServerInternalModelsDictionaryRequest**| Request | |


### Return type

**InternalHandlersDictionaryResponse**

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

