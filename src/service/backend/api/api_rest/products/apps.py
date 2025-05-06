from django.apps import AppConfig


class ProductsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api_rest.products'
    
    def ready(self):
        import api_rest.products.signals