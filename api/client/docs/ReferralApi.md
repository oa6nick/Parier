# ReferralApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**referralCodeGet**](#referralcodeget) | **GET** /referral/code | Get referral code|
|[**referralStatsGet**](#referralstatsget) | **GET** /referral/stats | Get referral stats|

# **referralCodeGet**
> InternalHandlersReferralCodeResponse referralCodeGet()

Get or generate user\'s referral code

### Example

```typescript
import {
    ReferralApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferralApi(configuration);

const { status, data } = await apiInstance.referralCodeGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**InternalHandlersReferralCodeResponse**

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

# **referralStatsGet**
> ParierServerInternalServiceReferralStatsResponse referralStatsGet()

Get referral statistics (total referrals, earnings, list)

### Example

```typescript
import {
    ReferralApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferralApi(configuration);

const { status, data } = await apiInstance.referralStatsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ParierServerInternalServiceReferralStatsResponse**

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

