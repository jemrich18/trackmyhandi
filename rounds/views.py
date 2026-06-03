from rest_framework import generics, permissions
from .models import Round
from .serializers import RoundSerializer

class RoundListCreateView(generics.ListCreateAPIView):
    serializer_class = RoundSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Round.objects.filter(user=self.request.user)

class RoundDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RoundSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Round.objects.filter(user=self.request.user)