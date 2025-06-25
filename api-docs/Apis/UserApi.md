# UserApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**checkEmailExists**](UserApi.md#checkEmailExists) | **GET** /api/users/check/email | Check if email exists |
| [**checkUsernameExists**](UserApi.md#checkUsernameExists) | **GET** /api/users/check/username | Check if username exists |
| [**createUser**](UserApi.md#createUser) | **POST** /api/users | Create a new user |
| [**deleteUser**](UserApi.md#deleteUser) | **DELETE** /api/users/{id} | Delete user |
| [**getAllUsers**](UserApi.md#getAllUsers) | **GET** /api/users | Get all users |
| [**getCurrentUser**](UserApi.md#getCurrentUser) | **GET** /api/users/me | Get current user |
| [**getUser**](UserApi.md#getUser) | **GET** /api/users/{id} | Get user by ID |
| [**getUserLocation**](UserApi.md#getUserLocation) | **GET** /api/users/{id}/location | Get user location |
| [**setUserLocation**](UserApi.md#setUserLocation) | **POST** /api/users/{id}/location | Set user location |
| [**updateCurrentUserLocation**](UserApi.md#updateCurrentUserLocation) | **PUT** /api/users/location | Update current user location |
| [**updateUser**](UserApi.md#updateUser) | **PUT** /api/users/{id} | Update user |
| [**updateUserLocation**](UserApi.md#updateUserLocation) | **PUT** /api/users/{id}/location | Update user location |


<a name="checkEmailExists"></a>
# **checkEmailExists**
> Boolean checkEmailExists(email)

Check if email exists

    Checks if an email is already registered.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **email** | **String**|  | [default to null] |

### Return type

**Boolean**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

<a name="checkUsernameExists"></a>
# **checkUsernameExists**
> Boolean checkUsernameExists(username)

Check if username exists

    Checks if a username is already registered.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **username** | **String**|  | [default to null] |

### Return type

**Boolean**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

<a name="createUser"></a>
# **createUser**
> UserDTO createUser(password, UserDTO)

Create a new user

    Creates a new user with the provided details and password.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **password** | **String**|  | [default to null] |
| **UserDTO** | [**UserDTO**](../Models/UserDTO.md)|  | |

### Return type

[**UserDTO**](../Models/UserDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

<a name="deleteUser"></a>
# **deleteUser**
> deleteUser(id)

Delete user

    Deletes a user by their UUID.

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

<a name="getAllUsers"></a>
# **getAllUsers**
> List getAllUsers()

Get all users

    Returns a list of all users.

### Parameters
This endpoint does not need any parameter.

### Return type

[**List**](../Models/UserDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

<a name="getCurrentUser"></a>
# **getCurrentUser**
> UserDTO getCurrentUser()

Get current user

    Returns the currently authenticated user.

### Parameters
This endpoint does not need any parameter.

### Return type

[**UserDTO**](../Models/UserDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

<a name="getUser"></a>
# **getUser**
> UserDTO getUser(id)

Get user by ID

    Returns a single user by their UUID.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**|  | [default to null] |

### Return type

[**UserDTO**](../Models/UserDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

<a name="getUserLocation"></a>
# **getUserLocation**
> LocationDTO getUserLocation(id)

Get user location

    Returns the location of a user by UUID.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**|  | [default to null] |

### Return type

[**LocationDTO**](../Models/LocationDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*

<a name="setUserLocation"></a>
# **setUserLocation**
> setUserLocation(id, LocationDTO)

Set user location

    Sets the location of a user by UUID.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**|  | [default to null] |
| **LocationDTO** | [**LocationDTO**](../Models/LocationDTO.md)|  | |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

<a name="updateCurrentUserLocation"></a>
# **updateCurrentUserLocation**
> updateCurrentUserLocation(LocationDTO)

Update current user location

    Updates the location of the currently authenticated user.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **LocationDTO** | [**LocationDTO**](../Models/LocationDTO.md)|  | |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

<a name="updateUser"></a>
# **updateUser**
> UserDTO updateUser(id, UserDTO)

Update user

    Updates the details of an existing user by UUID.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**|  | [default to null] |
| **UserDTO** | [**UserDTO**](../Models/UserDTO.md)|  | |

### Return type

[**UserDTO**](../Models/UserDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*

<a name="updateUserLocation"></a>
# **updateUserLocation**
> updateUserLocation(id, latitude, longitude)

Update user location

    Updates the location of a user by UUID.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**|  | [default to null] |
| **latitude** | **Double**|  | [default to null] |
| **longitude** | **Double**|  | [default to null] |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

