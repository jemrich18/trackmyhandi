from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Register your models here.
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'is_premium', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Premium', {'fields': ('is_premium', 'stripe_customer_id', 'stripe_subscription_id', 'subscription_end_date')}),
    )