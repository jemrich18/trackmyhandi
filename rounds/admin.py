from django.contrib import admin
from .models import Round

@admin.register(Round)
class RoundAdmin(admin.ModelAdmin):
    list_display = ['user', 'course_name', 'score', 'date_played', 'miss_category']
    list_filter = ['miss_category', 'weather', 'green_speed']