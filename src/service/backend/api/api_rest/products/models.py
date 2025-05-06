from django.db import models
from api_rest.users.models import User
from django.core.exceptions import ValidationError

class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(null=False)
    created_by = models.ForeignKey(
        'users.User', 
        related_name='products_created_by_user',
        on_delete=models.CASCADE,
        null=True,  # Permite que o criador seja definido pelo serializer
    )
    purchased_by = models.ManyToManyField(
        'users.User', 
        related_name='products_purchased_by_user',  # Nome único
        blank=True,
    )
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)

    def __str__(self):
        return self.name

    def clean(self):
        # Validação de imagem
        if self.image:
            file_type = self.image.file.content_type
            if file_type not in ['image/jpeg', 'image/png', 'image/webp']:
                raise ValidationError('A imagem deve ser JPG, JPEG, PNG ou WebP.')
        
        # Validação de preço positivo
        if self.price <= 0:
            raise ValidationError('O preço deve ser um valor positivo.')
