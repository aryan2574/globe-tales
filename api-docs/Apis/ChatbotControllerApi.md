# ChatbotControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**chat**](ChatbotControllerApi.md#chat) | **POST** /api/chat |  |
| [**getGreeting**](ChatbotControllerApi.md#getGreeting) | **GET** /api/chat/greeting |  |


<a name="chat"></a>
# **chat**
> ChatbotResponse chat(ChatbotRequest)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **ChatbotRequest** | [**ChatbotRequest**](../Models/ChatbotRequest.md)|  | |

### Return type

[**ChatbotResponse**](../Models/ChatbotResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

<a name="getGreeting"></a>
# **getGreeting**
> ChatbotResponse getGreeting(lat, lon)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **lat** | **Double**|  | [default to null] |
| **lon** | **Double**|  | [default to null] |

### Return type

[**ChatbotResponse**](../Models/ChatbotResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

