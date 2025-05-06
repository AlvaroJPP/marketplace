from django.contrib import admin
from .models import User  # Certifique-se de importar Product
from api_rest.products.models import Product

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'role', 'is_active', 'is_staff', 'created_at')
    search_fields = ('email', 'name')
    list_filter = ('role', 'is_active', 'is_staff')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

    def get_fieldsets(self, request, obj=None):
        fieldsets = [
            (None, {'fields': ('email', 'password')}),  # Campos básicos
            ('Informações pessoais', {'fields': ('name', 'profile_picture', 'role')}),  # Informações pessoais
            ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser')}),  # Permissões de admin
            ('Datas', {'fields': ('created_at', 'updated_at')}),  # Campos de datas
        ]

        # Se for edição de um usuário existente
        if obj:
            if obj.role == 'seller':
                fieldsets.append(
                    ('Produtos Criados (edição completa)', {
                        'fields': ('created_products',),  # Relacionamento ManyToMany dos produtos criados
                    })
                )
            elif obj.role == 'user':
                fieldsets.append(
                    ('Produtos Comprados', {
                        'fields': ('purchased_products',),  # Relacionamento ManyToMany dos produtos comprados
                    })
                )
                fieldsets.append(
                    ('Carrinho de Compras', {
                        'fields': ('cart',),  # Relacionamento ManyToMany dos produtos no carrinho
                    })
                )
            

        return fieldsets

    def produtos_criados(self, obj):
        # Retorna os nomes dos produtos criados pelo vendedor
        produtos = Product.objects.filter(created_by=obj)
        if produtos.exists():
            return ", ".join([p.name for p in produtos])
        return "Nenhum produto criado"

    produtos_criados.short_description = "Produtos Criados"

    # Permite edição total dos produtos criados, removendo a limitação de somente leitura
    filter_horizontal = ('created_products', 'purchased_products','cart')
