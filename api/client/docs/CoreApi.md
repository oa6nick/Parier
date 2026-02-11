# CoreApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**coreLocalesLangNsGet**](#corelocaleslangnsget) | **GET** /core/locales/{lang}/{ns} | Get locales|
|[**corePropertiesEnumsPost**](#corepropertiesenumspost) | **POST** /core/properties-enums | Get properties enums|
|[**corePropertiesTypesIdPost**](#corepropertiestypesidpost) | **POST** /core/properties-types/{id} | Get properties type by id|
|[**corePropertiesTypesPost**](#corepropertiestypespost) | **POST** /core/properties-types | Get paginated list of properties types|

# **coreLocalesLangNsGet**
> { [key: string]: string; } coreLocalesLangNsGet()

Get locales

### Example

```typescript
import {
    CoreApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CoreApi(configuration);

let lang: string; //Language (default to undefined)
let ns: string; //Namespace (default to undefined)

const { status, data } = await apiInstance.coreLocalesLangNsGet(
    lang,
    ns
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **lang** | [**string**] | Language | defaults to undefined|
| **ns** | [**string**] | Namespace | defaults to undefined|


### Return type

**{ [key: string]: string; }**

### Authorization

[OAuth2Keycloak](../README.md#OAuth2Keycloak), [BasicAuth](../README.md#BasicAuth), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **corePropertiesEnumsPost**
> InternalHandlersPropertiesEnumsResponse corePropertiesEnumsPost(filter)

Get properties enums

### Example

```typescript
import {
    CoreApi,
    Configuration,
    ParierServerInternalRepositoryPropertiesEnumFilter
} from './api';

const configuration = new Configuration();
const apiInstance = new CoreApi(configuration);

let filter: ParierServerInternalRepositoryPropertiesEnumFilter; //Filter parameters

const { status, data } = await apiInstance.corePropertiesEnumsPost(
    filter
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **filter** | **ParierServerInternalRepositoryPropertiesEnumFilter**| Filter parameters | |


### Return type

**InternalHandlersPropertiesEnumsResponse**

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

# **corePropertiesTypesIdPost**
> InternalHandlersPropertiesTypeResponse corePropertiesTypesIdPost(filter)

Get properties type by id

### Example

```typescript
import {
    CoreApi,
    Configuration,
    ParierServerInternalModelsDefaultRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CoreApi(configuration);

let id: string; //Properties type id (default to undefined)
let filter: ParierServerInternalModelsDefaultRequest; //Filter parameters

const { status, data } = await apiInstance.corePropertiesTypesIdPost(
    id,
    filter
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **filter** | **ParierServerInternalModelsDefaultRequest**| Filter parameters | |
| **id** | [**string**] | Properties type id | defaults to undefined|


### Return type

**InternalHandlersPropertiesTypeResponse**

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

# **corePropertiesTypesPost**
> InternalHandlersPropertiesTypesResponse corePropertiesTypesPost(filter)

Get paginated list of properties types with filtering

### Example

```typescript
import {
    CoreApi,
    Configuration,
    ParierServerInternalRepositoryPropertiesTypeFilter
} from './api';

const configuration = new Configuration();
const apiInstance = new CoreApi(configuration);

let filter: ParierServerInternalRepositoryPropertiesTypeFilter; //Filter parameters

const { status, data } = await apiInstance.corePropertiesTypesPost(
    filter
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **filter** | **ParierServerInternalRepositoryPropertiesTypeFilter**| Filter parameters | |


### Return type

**InternalHandlersPropertiesTypesResponse**

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

