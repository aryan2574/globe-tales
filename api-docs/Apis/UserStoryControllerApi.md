# UserStoryControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createStory**](UserStoryControllerApi.md#createStory) | **POST** /api/stories |  |
| [**deleteStory**](UserStoryControllerApi.md#deleteStory) | **DELETE** /api/stories/{id} |  |
| [**getStoriesForUser**](UserStoryControllerApi.md#getStoriesForUser) | **GET** /api/stories |  |
| [**getStoryById**](UserStoryControllerApi.md#getStoryById) | **GET** /api/stories/{id} |  |
| [**getVisitedSitesForUser**](UserStoryControllerApi.md#getVisitedSitesForUser) | **GET** /api/stories/visited |  |
| [**markSiteAsVisited**](UserStoryControllerApi.md#markSiteAsVisited) | **POST** /api/stories/visit/{placeId} |  |
| [**updateStory**](UserStoryControllerApi.md#updateStory) | **PUT** /api/stories/{id} |  |


<a name="createStory"></a>
# **createStory**
> UserStoryDTO createStory(UserStoryDTO)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **UserStoryDTO** | [**UserStoryDTO**](../Models/UserStoryDTO.md)|  | |

### Return type

[**UserStoryDTO**](../Models/UserStoryDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

<a name="deleteStory"></a>
# **deleteStory**
> deleteStory(id)



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

<a name="getStoriesForUser"></a>
# **getStoriesForUser**
> List getStoriesForUser()



### Parameters
This endpoint does not need any parameter.

### Return type

[**List**](../Models/UserStoryDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

<a name="getStoryById"></a>
# **getStoryById**
> UserStoryDTO getStoryById(id)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**|  | [default to null] |

### Return type

[**UserStoryDTO**](../Models/UserStoryDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

<a name="getVisitedSitesForUser"></a>
# **getVisitedSitesForUser**
> List getVisitedSitesForUser()



### Parameters
This endpoint does not need any parameter.

### Return type

[**List**](../Models/UserStoryDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

<a name="markSiteAsVisited"></a>
# **markSiteAsVisited**
> UserStoryDTO markSiteAsVisited(placeId)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **placeId** | **String**|  | [default to null] |

### Return type

[**UserStoryDTO**](../Models/UserStoryDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

<a name="updateStory"></a>
# **updateStory**
> UserStoryDTO updateStory(id, UserStoryDTO)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**|  | [default to null] |
| **UserStoryDTO** | [**UserStoryDTO**](../Models/UserStoryDTO.md)|  | |

### Return type

[**UserStoryDTO**](../Models/UserStoryDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

