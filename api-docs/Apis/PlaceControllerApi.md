# PlaceControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**fetchPlacesForArea**](PlaceControllerApi.md#fetchPlacesForArea) | **POST** /api/places/fetch |  |
| [**getAllPlaces**](PlaceControllerApi.md#getAllPlaces) | **GET** /api/places |  |
| [**getPlaceById**](PlaceControllerApi.md#getPlaceById) | **GET** /api/places/{id} |  |
| [**updateSitesForArea**](PlaceControllerApi.md#updateSitesForArea) | **POST** /api/places/update-area |  |


<a name="fetchPlacesForArea"></a>
# **fetchPlacesForArea**
> String fetchPlacesForArea(bbox)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **bbox** | **String**|  | [default to null] |

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

<a name="getAllPlaces"></a>
# **getAllPlaces**
> List getAllPlaces()



### Parameters
This endpoint does not need any parameter.

### Return type

[**List**](../Models/Place.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

<a name="getPlaceById"></a>
# **getPlaceById**
> Place getPlaceById(id)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **Long**|  | [default to null] |

### Return type

[**Place**](../Models/Place.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

<a name="updateSitesForArea"></a>
# **updateSitesForArea**
> String updateSitesForArea(bbox)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **bbox** | **String**|  | [default to null] |

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

