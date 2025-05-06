from django.contrib import admin
from .models import Product
from api_rest.users.models import User  # importe o modelo de usuário

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    search_fields = ('name', 'created_by__email')
    list_filter = ('created_by', 'price')
    filter_horizontal = ('purchased_by',)  # Corrigido: adicionado vírgula para definir como tupla

    def get_created_at(self, obj):
        return obj.created_by.created_at
    get_created_at.short_description = 'Created At (User)'

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'created_by':
            kwargs["queryset"] = User.objects.filter(role='seller')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
