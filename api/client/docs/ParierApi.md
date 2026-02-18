# ParierApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**parierBetBetIdCommentPut**](#parierbetbetidcommentput) | **PUT** /parier/bet/{bet_id}/comment | Create bet comment|
|[**parierBetBetIdCommentsPost**](#parierbetbetidcommentspost) | **POST** /parier/bet/{bet_id}/comments | Get bet comments|
|[**parierBetBetIdLikePost**](#parierbetbetidlikepost) | **POST** /parier/bet/{bet_id}/like | Like bet|
|[**parierBetBetIdUnlikePost**](#parierbetbetidunlikepost) | **POST** /parier/bet/{bet_id}/unlike | Unlike bet|
|[**parierBetPost**](#parierbetpost) | **POST** /parier/bet | Get bets|
|[**parierBetPut**](#parierbetput) | **PUT** /parier/bet | Create bet|
|[**parierBetStatusesPost**](#parierbetstatusespost) | **POST** /parier/bet-statuses | Get bet statuses|
|[**parierBetTypesPost**](#parierbettypespost) | **POST** /parier/bet-types | Get bet types|
|[**parierCategoriesPost**](#pariercategoriespost) | **POST** /parier/categories | Get categories|
|[**parierCommentCommentIdLikePost**](#pariercommentcommentidlikepost) | **POST** /parier/comment/{comment_id}/like | Like bet comment|
|[**parierCommentCommentIdUnlikePost**](#pariercommentcommentidunlikepost) | **POST** /parier/comment/{comment_id}/unlike | Unlike bet comment|
|[**parierLikeTypesPost**](#parierliketypespost) | **POST** /parier/like-types | Get like types|
|[**parierUserGet**](#parieruserget) | **GET** /parier/user | Get current user|
|[**parierVerificationSourcesPost**](#parierverificationsourcespost) | **POST** /parier/verification-sources | Get verification sources|

# **parierBetBetIdCommentPut**
> ParierServerInternalModelsSuccessResponse parierBetBetIdCommentPut(request)

Create bet comment

### Example

```typescript
import {
    ParierApi,
    Configuration,
    ParierServerInternalModelsBetCommentCreateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ParierApi(configuration);

let betId: string; //Bet ID (default to undefined)
let request: ParierServerInternalModelsBetCommentCreateRequest; //Request

const { status, data } = await apiInstance.parierBetBetIdCommentPut(
    betId,
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **ParierServerInternalModelsBetCommentCreateRequest**| Request | |
| **betId** | [**string**] | Bet ID | defaults to undefined|


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

# **parierBetBetIdCommentsPost**
> InternalHandlersBetCommentResponse parierBetBetIdCommentsPost(request)

Get bet comments

### Example

```typescript
import {
    ParierApi,
    Configuration,
    ParierServerInternalModelsBetCommentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ParierApi(configuration);

let betId: string; //Bet ID (default to undefined)
let request: ParierServerInternalModelsBetCommentRequest; //Request

const { status, data } = await apiInstance.parierBetBetIdCommentsPost(
    betId,
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **ParierServerInternalModelsBetCommentRequest**| Request | |
| **betId** | [**string**] | Bet ID | defaults to undefined|


### Return type

**InternalHandlersBetCommentResponse**

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

# **parierBetBetIdLikePost**
> ParierServerInternalModelsSuccessResponse parierBetBetIdLikePost()

Like bet

### Example

```typescript
import {
    ParierApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParierApi(configuration);

let betId: string; //Bet ID (default to undefined)

const { status, data } = await apiInstance.parierBetBetIdLikePost(
    betId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **betId** | [**string**] | Bet ID | defaults to undefined|


### Return type

**ParierServerInternalModelsSuccessResponse**

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

# **parierBetBetIdUnlikePost**
> ParierServerInternalModelsSuccessResponse parierBetBetIdUnlikePost()

Unlike bet

### Example

```typescript
import {
    ParierApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParierApi(configuration);

let betId: string; //Bet ID (default to undefined)

const { status, data } = await apiInstance.parierBetBetIdUnlikePost(
    betId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **betId** | [**string**] | Bet ID | defaults to undefined|


### Return type

**ParierServerInternalModelsSuccessResponse**

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

# **parierCommentCommentIdLikePost**
> ParierServerInternalModelsSuccessResponse parierCommentCommentIdLikePost()

Like bet comment

### Example

```typescript
import {
    ParierApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParierApi(configuration);

let commentId: string; //Comment ID (default to undefined)

const { status, data } = await apiInstance.parierCommentCommentIdLikePost(
    commentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commentId** | [**string**] | Comment ID | defaults to undefined|


### Return type

**ParierServerInternalModelsSuccessResponse**

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

# **parierCommentCommentIdUnlikePost**
> ParierServerInternalModelsSuccessResponse parierCommentCommentIdUnlikePost()

Unlike bet comment

### Example

```typescript
import {
    ParierApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParierApi(configuration);

let commentId: string; //Comment ID (default to undefined)

const { status, data } = await apiInstance.parierCommentCommentIdUnlikePost(
    commentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commentId** | [**string**] | Comment ID | defaults to undefined|


### Return type

**ParierServerInternalModelsSuccessResponse**

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

# **parierUserGet**
> InternalHandlersCurrentUserResponse parierUserGet()

Get current user

### Example

```typescript
import {
    ParierApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParierApi(configuration);

const { status, data } = await apiInstance.parierUserGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**InternalHandlersCurrentUserResponse**

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

