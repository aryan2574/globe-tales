# PlaceReviewControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createReview**](PlaceReviewControllerApi.md#createReview) | **POST** /api/reviews |  |
| [**deleteReview**](PlaceReviewControllerApi.md#deleteReview) | **DELETE** /api/reviews/{id} |  |
| [**getReviewsByPlaceId**](PlaceReviewControllerApi.md#getReviewsByPlaceId) | **GET** /api/reviews/place/{placeId} |  |
| [**getReviewsByUserId**](PlaceReviewControllerApi.md#getReviewsByUserId) | **GET** /api/reviews/user/{userId} |  |
| [**updateReview**](PlaceReviewControllerApi.md#updateReview) | **PUT** /api/reviews/{id} |  |


<a name="createReview"></a>
# **createReview**
> PlaceReviewDTO createReview(PlaceReviewDTO)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **PlaceReviewDTO** | [**PlaceReviewDTO**](../Models/PlaceReviewDTO.md)|  | |

### Return type

[**PlaceReviewDTO**](../Models/PlaceReviewDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

<a name="deleteReview"></a>
# **deleteReview**
> deleteReview(id)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**|  | [default to null] |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

<a name="getReviewsByPlaceId"></a>
# **getReviewsByPlaceId**
> List getReviewsByPlaceId(placeId)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **placeId** | **String**|  | [default to null] |

### Return type

[**List**](../Models/PlaceReviewDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

<a name="getReviewsByUserId"></a>
# **getReviewsByUserId**
> List getReviewsByUserId(userId)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | **UUID**|  | [default to null] |

### Return type

[**List**](../Models/PlaceReviewDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

<a name="updateReview"></a>
# **updateReview**
> PlaceReviewDTO updateReview(id, PlaceReviewDTO)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**|  | [default to null] |
| **PlaceReviewDTO** | [**PlaceReviewDTO**](../Models/PlaceReviewDTO.md)|  | |

### Return type

[**PlaceReviewDTO**](../Models/PlaceReviewDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

