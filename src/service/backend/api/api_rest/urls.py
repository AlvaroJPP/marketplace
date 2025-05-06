from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from api_rest.users.views import CustomTokenObtainPairView

urlpatterns = [
    path('products/', include('api_rest.products.urls')),
    path('users/', include('api_rest.users.urls')),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]