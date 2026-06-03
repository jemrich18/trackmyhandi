from django.db import models
from django.conf import settings

class Round(models.Model):

    MISS_CATEGORIES = [
        ('driving', 'Driving'),
        ('iron_play', 'Iron Play'),
        ('chipping', 'Chipping'),
        ('putting', 'Putting'),
        ('bunker', 'Bunker'),
    ]

    WEATHER_CONDITIONS = [
        ('sunny', 'Sunny'),
        ('cloudy', 'Cloudy'),
        ('windy', 'Windy'),
        ('rainy', 'Rainy'),
    ]

    WIND_STRENGTH = [
        ('none', 'None'),
        ('light', 'Light'),
        ('moderate', 'Moderate'),
        ('strong', 'Strong'),
    ]

    GREEN_SPEED = [
        ('slow', 'Slow'),
        ('normal', 'Normal'),
        ('fast', 'Fast'),
    ]

    GREEN_FIRMNESS = [
        ('soft', 'Soft'),
        ('normal', 'Normal'),
        ('firm', 'Firm'),
    ]

    FAIRWAY_CONDITIONS = [
        ('wet', 'Wet'),
        ('normal', 'Normal'),
        ('dry', 'Dry'),
        ('firm', 'Firm'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='rounds')
    score = models.IntegerField()
    course_name = models.CharField(max_length=255)
    course_rating = models.DecimalField(max_digits=4, decimal_places=1)
    slope_rating = models.IntegerField()
    date_played = models.DateField()

    # conditions
    weather = models.CharField(max_length=20, choices=WEATHER_CONDITIONS, blank=True, null=True)
    wind_strength = models.CharField(max_length=20, choices=WIND_STRENGTH, blank=True, null=True)
    green_speed = models.CharField(max_length=20, choices=GREEN_SPEED, blank=True, null=True)
    green_firmness = models.CharField(max_length=20, choices=GREEN_FIRMNESS, blank=True, null=True)
    fairway_conditions = models.CharField(max_length=20, choices=FAIRWAY_CONDITIONS, blank=True, null=True)

    # reflection
    miss_category = models.CharField(max_length=20, choices=MISS_CATEGORIES, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_played']

    def __str__(self):
        return f"{self.user.username} - {self.course_name} - {self.date_played}"