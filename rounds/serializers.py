from rest_framework import serializers 
from .models import Round 
from django.contrib.auth import get_user_model 

User = get_user_model()


class RoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Round 
        fields = [
            'id',
            'score',
            'course_name',
            'course_rating',
            'slope_rating',
            'date_played',
            'weather',
            'wind_strength',
            'green_speed',
            'green_firmness',
            'fairway_conditions',
            'miss_category',
            'notes',
            'created_at'
        ]
        read_only_fields = ['created_at']


    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)