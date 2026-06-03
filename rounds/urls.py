from django.urls import path 
from .views import RoundListCreateView, RoundDetailView


urlpatterns = [
    path('', RoundListCreateView.as_view(), name='round-list-create'),
    path('<int:pk>/', RoundDetailView.as_view(), name='round-detail'),
]