from rest_framework import serializers
from .models import Round
from django.contrib.auth import get_user_model

User = get_user_model()


class RoundSerializer(serializers.ModelSerializer):
    score_differential = serializers.SerializerMethodField()

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
            'score_differential',
            'created_at',
        ]
        read_only_fields = ['score_differential', 'created_at']

    def get_score_differential(self, obj):
        # WHS formula: (score - course_rating) * 113 / slope_rating
        return round((obj.score - float(obj.course_rating)) * 113 / obj.slope_rating, 1)

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)