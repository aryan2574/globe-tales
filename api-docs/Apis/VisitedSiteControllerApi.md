# VisitedSiteControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**addVisitedSite**](VisitedSiteControllerApi.md#addVisitedSite) | **POST** /api/visited-sites |  |
| [**getVisitedSitesByUser**](VisitedSiteControllerApi.md#getVisitedSitesByUser) | **GET** /api/visited-sites/user/{userId} |  |
| [**isSiteVisited**](VisitedSiteControllerApi.md#isSiteVisited) | **GET** /api/visited-sites/check |  |
| [**removeVisitedSite**](VisitedSiteControllerApi.md#removeVisitedSite) | **DELETE** /api/visited-sites/user/{userId}/place/{placeId} |  |


<a name="addVisitedSite"></a>
# **addVisitedSite**
> VisitedSite addVisitedSite(VisitedSite)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **VisitedSite** | [**VisitedSite**](../Models/VisitedSite.md)|  | |

### Return type

[**VisitedSite**](../Models/VisitedSite.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

<a name="getVisitedSitesByUser"></a>
# **getVisitedSitesByUser**
> List getVisitedSitesByUser(userId)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | **String**|  | [default to null] |

### Return type

[**List**](../Models/VisitedSite.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

<a name="isSiteVisited"></a>
# **isSiteVisited**
> Boolean isSiteVisited(userId, placeId)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | **String**|  | [default to null] |
| **placeId** | **Long**|  | [default to null] |

### Return type

**Boolean**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

<a name="removeVisitedSite"></a>
# **removeVisitedSite**
> removeVisitedSite(userId, placeId)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | **String**|  | [default to null] |
| **placeId** | **Long**|  | [default to null] |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

