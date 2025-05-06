from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description', 'created_by', 'purchased_by', 'image']
        read_only_fields = ['created_by']  # O campo 'created_by' não pode ser modificado diretamente pelo cliente

    def create(self, validated_data):
        # Pega o usuário autenticado a partir da requisição
        user = self.context['request'].user
        validated_data['created_by'] = user  # Associa o usuário ao campo 'created_by'
        return super().create(validated_data)  # Cria o produto

    def update(self, instance, validated_data):
        """
        Atualiza apenas os campos que foram enviados
        """
        # Atualiza os campos que foram passados na requisição
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.image = validated_data.get('image', instance.image)
        instance.price = validated_data.get('price', instance.price)
        instance.save()
        return instance