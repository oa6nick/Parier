# AdminApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminCreditPreviewGet**](#admincreditpreviewget) | **GET** /admin/credit-preview | Get admin credit preview|
|[**adminCreditTokensPost**](#admincredittokenspost) | **POST** /admin/credit-tokens | Credit tokens to users by rule|

# **adminCreditPreviewGet**
> InternalHandlersAdminCreditPreviewResponse adminCreditPreviewGet()

Get count of users matching the rule

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let rule: string; //Rule (default to undefined)
let days: string; //Days (optional) (default to undefined)
let maxBalance: string; //Max balance (optional) (default to undefined)
let minBets: string; //Min bets (optional) (default to undefined)

const { status, data } = await apiInstance.adminCreditPreviewGet(
    rule,
    days,
    maxBalance,
    minBets
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **rule** | [**string**] | Rule | defaults to undefined|
| **days** | [**string**] | Days | (optional) defaults to undefined|
| **maxBalance** | [**string**] | Max balance | (optional) defaults to undefined|
| **minBets** | [**string**] | Min bets | (optional) defaults to undefined|


### Return type

**InternalHandlersAdminCreditPreviewResponse**

### Authorization

[OAuth2Keycloak](../README.md#OAuth2Keycloak), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminCreditTokensPost**
> InternalHandlersAdminCreditResponse adminCreditTokensPost(request)

Credit tokens to users by rule

### Example

```typescript
import {
    AdminApi,
    Configuration,
    InternalHandlersAdminCreditRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let request: InternalHandlersAdminCreditRequest; //Admin credit request

const { status, data } = await apiInstance.adminCreditTokensPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **InternalHandlersAdminCreditRequest**| Admin credit request | |


### Return type

**InternalHandlersAdminCreditResponse**

### Authorization

[OAuth2Keycloak](../README.md#OAuth2Keycloak), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

