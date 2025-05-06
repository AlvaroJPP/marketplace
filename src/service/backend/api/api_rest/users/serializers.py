from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.utils.translation import gettext_lazy as _
from api_rest.products.serializers import ProductSerializer
User = get_user_model()

from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    profile_picture_url = serializers.SerializerMethodField()

    # Usando PrimaryKeyRelatedField para exibir os detalhes completos dos produtos comprados e no carrinho
    purchased_products = ProductSerializer(many=True, read_only=True)  # Produtos comprados com todos os detalhes
    cart = ProductSerializer(many=True, read_only=True)  # Produtos no carrinho com todos os detalhes

    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'password', 'role', 'created_at', 'updated_at',
            'purchased_products', 'cart', 'profile_picture', 'profile_picture_url'
        ]
        extra_kwargs = {
            'password': {'write_only': True},  # Garantir que a senha não seja retornada na resposta
        }

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            return obj.profile_picture.url  # Retorna a URL da imagem
        return None

    def create(self, validated_data):
        profile_picture = validated_data.pop('profile_picture', None)  # Pega a imagem separadamente
        user = User(**validated_data)  # Cria o usuário sem salvar imediatamente
        user.set_password(validated_data['password'])  # Define a senha com segurança
        user.save()  # Salva o usuário no banco de dados

        if profile_picture:
            user.profile_picture = profile_picture  # Atribui a imagem
            user.save()  # Salva novamente para atualizar o campo da imagem

        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'name': self.user.name,
            'role': self.user.role,
        }
        return data

