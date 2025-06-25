# UserFavouriteControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**addFavourite**](UserFavouriteControllerApi.md#addFavourite) | **POST** /api/user-favourites |  |
| [**deleteFavouriteByUserAndSite**](UserFavouriteControllerApi.md#deleteFavouriteByUserAndSite) | **DELETE** /api/user-favourites/user/{userId}/site/{siteId} |  |
| [**getFavouritesByType**](UserFavouriteControllerApi.md#getFavouritesByType) | **GET** /api/user-favourites/user/{userId}/type/{siteType} |  |
| [**getFavouritesByUserId**](UserFavouriteControllerApi.md#getFavouritesByUserId) | **GET** /api/user-favourites/user/{userId} |  |


<a name="addFavourite"></a>
# **addFavourite**
> UserFavouriteDTO addFavourite(UserFavouriteDTO)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **UserFavouriteDTO** | [**UserFavouriteDTO**](../Models/UserFavouriteDTO.md)|  | |

### Return type

[**UserFavouriteDTO**](../Models/UserFavouriteDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

<a name="deleteFavouriteByUserAndSite"></a>
# **deleteFavouriteByUserAndSite**
> deleteFavouriteByUserAndSite(userId, siteId)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | **UUID**|  | [default to null] |
| **siteId** | **Long**|  | [default to null] |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

<a name="getFavouritesByType"></a>
# **getFavouritesByType**
> List getFavouritesByType(userId, siteType)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | **UUID**|  | [default to null] |
| **siteType** | **String**|  | [default to null] |

### Return type

[**List**](../Models/UserFavouriteDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

<a name="getFavouritesByUserId"></a>
# **getFavouritesByUserId**
> List getFavouritesByUserId(userId)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | **UUID**|  | [default to null] |

### Return type

[**List**](../Models/UserFavouriteDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

