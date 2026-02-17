# WalletApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**walletBalanceGet**](#walletbalanceget) | **GET** /wallet/balance | Get wallet balance|
|[**walletDepositPost**](#walletdepositpost) | **POST** /wallet/deposit | Deposit to wallet|
|[**walletTransactionsGet**](#wallettransactionsget) | **GET** /wallet/transactions | Get wallet transactions|
|[**walletWithdrawPost**](#walletwithdrawpost) | **POST** /wallet/withdraw | Withdraw from wallet|

# **walletBalanceGet**
> InternalHandlersBalanceResponse walletBalanceGet()

Get wallet balance

### Example

```typescript
import {
    WalletApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

const { status, data } = await apiInstance.walletBalanceGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**InternalHandlersBalanceResponse**

### Authorization

[OAuth2Keycloak](../README.md#OAuth2Keycloak), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **walletDepositPost**
> InternalHandlersBalanceResponse walletDepositPost(request)

Deposit to wallet

### Example

```typescript
import {
    WalletApi,
    Configuration,
    InternalHandlersDepositRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

let request: InternalHandlersDepositRequest; //Deposit request

const { status, data } = await apiInstance.walletDepositPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **InternalHandlersDepositRequest**| Deposit request | |


### Return type

**InternalHandlersBalanceResponse**

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
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **walletTransactionsGet**
> InternalHandlersTransactionsResponse walletTransactionsGet()

Get wallet transactions

### Example

```typescript
import {
    WalletApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

let offset: number; //Offset (optional) (default to undefined)
let limit: number; //Limit (optional) (default to undefined)

const { status, data } = await apiInstance.walletTransactionsGet(
    offset,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **offset** | [**number**] | Offset | (optional) defaults to undefined|
| **limit** | [**number**] | Limit | (optional) defaults to undefined|


### Return type

**InternalHandlersTransactionsResponse**

### Authorization

[OAuth2Keycloak](../README.md#OAuth2Keycloak), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **walletWithdrawPost**
> InternalHandlersBalanceResponse walletWithdrawPost(request)

Withdraw from wallet

### Example

```typescript
import {
    WalletApi,
    Configuration,
    InternalHandlersWithdrawRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

let request: InternalHandlersWithdrawRequest; //Withdraw request

const { status, data } = await apiInstance.walletWithdrawPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **InternalHandlersWithdrawRequest**| Withdraw request | |


### Return type

**InternalHandlersBalanceResponse**

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
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

