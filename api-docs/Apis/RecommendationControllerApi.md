# RecommendationControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getRecommendations**](RecommendationControllerApi.md#getRecommendations) | **GET** /api/recommendations |  |


<a name="getRecommendations"></a>
# **getRecommendations**
> RecommendationResponseDTO getRecommendations(transportMode, maxDistance, page, size)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **transportMode** | **String**|  | [default to null] |
| **maxDistance** | **Double**|  | [default to null] |
| **page** | **Integer**|  | [optional] [default to 0] |
| **size** | **Integer**|  | [optional] [default to 10] |

### Return type

[**RecommendationResponseDTO**](../Models/RecommendationResponseDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

