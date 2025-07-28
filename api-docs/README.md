# Documentation for GlobeTales API

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://localhost:8080*

| Class | Method | HTTP request | Description |
|------------ | ------------- | ------------- | -------------|
| *AuthControllerApi* | [**login**](Apis/AuthControllerApi.md#login) | **POST** /api/auth/login |  |
*AuthControllerApi* | [**register**](Apis/AuthControllerApi.md#register) | **POST** /api/register |  |
| *ChatbotControllerApi* | [**chat**](Apis/ChatbotControllerApi.md#chat) | **POST** /api/chat |  |
*ChatbotControllerApi* | [**getGreeting**](Apis/ChatbotControllerApi.md#getgreeting) | **GET** /api/chat/greeting |  |
| *PlaceControllerApi* | [**fetchPlacesForArea**](Apis/PlaceControllerApi.md#fetchplacesforarea) | **POST** /api/places/fetch |  |
*PlaceControllerApi* | [**getAllPlaces**](Apis/PlaceControllerApi.md#getallplaces) | **GET** /api/places |  |
*PlaceControllerApi* | [**getPlaceById**](Apis/PlaceControllerApi.md#getplacebyid) | **GET** /api/places/{id} |  |
*PlaceControllerApi* | [**updateSitesForArea**](Apis/PlaceControllerApi.md#updatesitesforarea) | **POST** /api/places/update-area |  |
| *PlaceReviewControllerApi* | [**createReview**](Apis/PlaceReviewControllerApi.md#createreview) | **POST** /api/reviews |  |
*PlaceReviewControllerApi* | [**deleteReview**](Apis/PlaceReviewControllerApi.md#deletereview) | **DELETE** /api/reviews/{id} |  |
*PlaceReviewControllerApi* | [**getReviewsByPlaceId**](Apis/PlaceReviewControllerApi.md#getreviewsbyplaceid) | **GET** /api/reviews/place/{placeId} |  |
*PlaceReviewControllerApi* | [**getReviewsByUserId**](Apis/PlaceReviewControllerApi.md#getreviewsbyuserid) | **GET** /api/reviews/user/{userId} |  |
*PlaceReviewControllerApi* | [**updateReview**](Apis/PlaceReviewControllerApi.md#updatereview) | **PUT** /api/reviews/{id} |  |
| *RecommendationControllerApi* | [**getRecommendations**](Apis/RecommendationControllerApi.md#getrecommendations) | **GET** /api/recommendations |  |
| *RouteControllerApi* | [**getRoute**](Apis/RouteControllerApi.md#getroute) | **POST** /api/routes |  |
| *UserApi* | [**checkEmailExists**](Apis/UserApi.md#checkemailexists) | **GET** /api/users/check/email | Check if email exists |
*UserApi* | [**checkUsernameExists**](Apis/UserApi.md#checkusernameexists) | **GET** /api/users/check/username | Check if username exists |
*UserApi* | [**createUser**](Apis/UserApi.md#createuser) | **POST** /api/users | Create a new user |
*UserApi* | [**deleteUser**](Apis/UserApi.md#deleteuser) | **DELETE** /api/users/{id} | Delete user |
*UserApi* | [**getAllUsers**](Apis/UserApi.md#getallusers) | **GET** /api/users | Get all users |
*UserApi* | [**getCurrentUser**](Apis/UserApi.md#getcurrentuser) | **GET** /api/users/me | Get current user |
*UserApi* | [**getUser**](Apis/UserApi.md#getuser) | **GET** /api/users/{id} | Get user by ID |
*UserApi* | [**getUserLocation**](Apis/UserApi.md#getuserlocation) | **GET** /api/users/{id}/location | Get user location |
*UserApi* | [**setUserLocation**](Apis/UserApi.md#setuserlocation) | **POST** /api/users/{id}/location | Set user location |
*UserApi* | [**updateCurrentUserLocation**](Apis/UserApi.md#updatecurrentuserlocation) | **PUT** /api/users/location | Update current user location |
*UserApi* | [**updateUser**](Apis/UserApi.md#updateuser) | **PUT** /api/users/{id} | Update user |
*UserApi* | [**updateUserLocation**](Apis/UserApi.md#updateuserlocation) | **PUT** /api/users/{id}/location | Update user location |
| *UserAchievementControllerApi* | [**getAchievementsByUserId**](Apis/UserAchievementControllerApi.md#getachievementsbyuserid) | **GET** /api/user-achievements/user/{userId} |  |
| *UserFavouriteControllerApi* | [**addFavourite**](Apis/UserFavouriteControllerApi.md#addfavourite) | **POST** /api/user-favourites |  |
*UserFavouriteControllerApi* | [**deleteFavouriteByUserAndSite**](Apis/UserFavouriteControllerApi.md#deletefavouritebyuserandsite) | **DELETE** /api/user-favourites/user/{userId}/site/{siteId} |  |
*UserFavouriteControllerApi* | [**getFavouritesByType**](Apis/UserFavouriteControllerApi.md#getfavouritesbytype) | **GET** /api/user-favourites/user/{userId}/type/{siteType} |  |
*UserFavouriteControllerApi* | [**getFavouritesByUserId**](Apis/UserFavouriteControllerApi.md#getfavouritesbyuserid) | **GET** /api/user-favourites/user/{userId} |  |
| *UserStoryControllerApi* | [**createStory**](Apis/UserStoryControllerApi.md#createstory) | **POST** /api/stories |  |
*UserStoryControllerApi* | [**deleteStory**](Apis/UserStoryControllerApi.md#deletestory) | **DELETE** /api/stories/{id} |  |
*UserStoryControllerApi* | [**getStoriesForUser**](Apis/UserStoryControllerApi.md#getstoriesforuser) | **GET** /api/stories |  |
*UserStoryControllerApi* | [**getStoryById**](Apis/UserStoryControllerApi.md#getstorybyid) | **GET** /api/stories/{id} |  |
*UserStoryControllerApi* | [**getVisitedSitesForUser**](Apis/UserStoryControllerApi.md#getvisitedsitesforuser) | **GET** /api/stories/visited |  |
*UserStoryControllerApi* | [**markSiteAsVisited**](Apis/UserStoryControllerApi.md#marksiteasvisited) | **POST** /api/stories/visit/{placeId} |  |
*UserStoryControllerApi* | [**updateStory**](Apis/UserStoryControllerApi.md#updatestory) | **PUT** /api/stories/{id} |  |
| *VisitedSiteControllerApi* | [**addVisitedSite**](Apis/VisitedSiteControllerApi.md#addvisitedsite) | **POST** /api/visited-sites |  |
*VisitedSiteControllerApi* | [**getVisitedSitesByUser**](Apis/VisitedSiteControllerApi.md#getvisitedsitesbyuser) | **GET** /api/visited-sites/user/{userId} |  |
*VisitedSiteControllerApi* | [**isSiteVisited**](Apis/VisitedSiteControllerApi.md#issitevisited) | **GET** /api/visited-sites/check |  |
*VisitedSiteControllerApi* | [**removeVisitedSite**](Apis/VisitedSiteControllerApi.md#removevisitedsite) | **DELETE** /api/visited-sites/user/{userId}/place/{placeId} |  |
| *WeatherControllerApi* | [**getWeather**](Apis/WeatherControllerApi.md#getweather) | **GET** /api/weather |  |


<a name="documentation-for-models"></a>
## Documentation for Models

 - [AuthenticationRequest](./Models/AuthenticationRequest.md)
 - [AuthenticationResponse](./Models/AuthenticationResponse.md)
 - [ChatbotRequest](./Models/ChatbotRequest.md)
 - [ChatbotResponse](./Models/ChatbotResponse.md)
 - [CurrentWeatherDTO](./Models/CurrentWeatherDTO.md)
 - [Geometry](./Models/Geometry.md)
 - [LocationDTO](./Models/LocationDTO.md)
 - [Place](./Models/Place.md)
 - [PlaceReviewDTO](./Models/PlaceReviewDTO.md)
 - [PointDTO](./Models/PointDTO.md)
 - [RecommendationDTO](./Models/RecommendationDTO.md)
 - [RecommendationResponseDTO](./Models/RecommendationResponseDTO.md)
 - [RegisterRequest](./Models/RegisterRequest.md)
 - [RouteRequestDTO](./Models/RouteRequestDTO.md)
 - [RouteResponseDTO](./Models/RouteResponseDTO.md)
 - [UserAchievementDTO](./Models/UserAchievementDTO.md)
 - [UserDTO](./Models/UserDTO.md)
 - [UserFavouriteDTO](./Models/UserFavouriteDTO.md)
 - [UserStoryDTO](./Models/UserStoryDTO.md)
 - [VisitedSite](./Models/VisitedSite.md)
 - [WeatherResponseDTO](./Models/WeatherResponseDTO.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

All endpoints do not require authorization.
