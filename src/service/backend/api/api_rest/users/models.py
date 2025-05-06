from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, name, password=None, role='user', **extra_fields):
        if not email:
            raise ValueError('O endereço de e-mail é obrigatório')

        # Permite o role 'admin' se for um superusuário
        if role not in dict(self.model.ROLE_CHOICES).keys() and role != 'admin':
            raise ValueError('O role deve ser "user", "seller" ou "admin".')

        email = self.normalize_email(email)
        user = self.model(email=email, name=name, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):

        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    USER = 'user'
    SELLER = 'seller'
    ROLE_CHOICES = [(USER, 'User'), (SELLER, 'Seller')]

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=USER)

    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)  # Para upload de imagem
    profile_picture_url = models.URLField(null=True, blank=True)  # Para armazenar o URL da imagem
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_products = models.ManyToManyField(
        'products.Product',  
        related_name='users_created_products',  
        blank=True
    )

    purchased_products = models.ManyToManyField(
        'products.Product',  
        related_name='users_purchased_products', 
        blank=True
    )

    # Adicionando um campo para o carrinho
    cart = models.ManyToManyField(
        'products.Product',  
        related_name='users_cart',  
        blank=True
    )

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return f'{self.name} ({self.role})'
