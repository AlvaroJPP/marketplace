from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import NotAuthenticated, PermissionDenied
from django.db.models.signals import post_delete
from django.dispatch import receiver


from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'seller':
            return Product.objects.filter(created_by=user)
        return super().get_queryset()


    @action(detail=True, methods=['put'], permission_classes=[IsAuthenticated])
    def update_product(self, request, pk=None):
        product = self.get_object()
        # Validação do usuário
        if product.created_by != request.user:
            raise PermissionDenied("Você não pode editar este produto.")
        # Atualizar os dados do produto
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def perform_destroy(self, instance):
        user = self.request.user
        if not user.is_authenticated:
            raise NotAuthenticated("Você precisa estar autenticado para excluir um produto.")
        if user.role == 'seller' and instance.created_by != user:
            raise PermissionDenied("Você só pode excluir produtos criados por você.")
        if user.role not in ('seller', 'admin'):
            raise PermissionDenied("Apenas sellers ou admins podem excluir produtos.")
        instance.delete()

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def buy(self, request):
        product_ids = request.data.get('ids', [])
        user = request.user

        if user.role != 'user':
            raise PermissionDenied("Apenas usuários com role 'user' podem comprar produtos.")

        if not isinstance(product_ids, list) or not product_ids:
            return Response({"detail": "Uma lista de IDs de produtos é obrigatória."}, status=status.HTTP_400_BAD_REQUEST)

        produtos = Product.objects.filter(id__in=product_ids)

        if not produtos.exists():
            return Response({"detail": "Nenhum produto válido encontrado."}, status=status.HTTP_404_NOT_FOUND)

        comprados = []
        ja_comprados = []

        for produto in produtos:
            if user in produto.purchased_by.all():
                ja_comprados.append(produto.name)
                continue
            
            # Adiciona o usuário à lista de compradores do produto
            produto.purchased_by.add(user)
            
            # Adiciona o produto à lista de produtos comprados do usuário
            user.purchased_products.add(produto)  # Garantir que 'purchased_products' está configurado no modelo de User

            # Remove o produto do carrinho do usuário
            user.cart.remove(produto)
            
            comprados.append(produto.name)

        user.save()  # Salva as alterações no usuário

        return Response({
            "detail": f"{len(comprados)} produto(s) comprado(s) com sucesso.",
            "comprados": comprados,
            "ja_comprados": ja_comprados
        }, status=status.HTTP_200_OK)

 
          
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def create_multiple(self, request):
        user = request.user
        if user.role not in ('seller', 'admin'):
            raise PermissionDenied("Apenas sellers ou admins podem criar produtos.")

        name = request.data.get('name')
        price = request.data.get('price')
        description = request.data.get('description')
        image = request.data.get('image', None)
        quantity = int(request.data.get('quantity', 1))

        if not name or not price or not description:
            return Response({"detail": "Campos obrigatórios: name, price, description"}, status=400)

        created_products = []

        for i in range(quantity):
            product_data = {
                "name": f"{name}" if quantity > 1 else name,
                "price": price,
                "description": description,
                "created_by": user.id
            }
            if image:
                product_data['image'] = image

            serializer = self.get_serializer(data=product_data)
            serializer.is_valid(raise_exception=True)
            serializer.save(created_by=user)
            created_products.append(serializer.data)

        return Response(
            {
                "detail": f"{quantity} produtos criados com sucesso.",
                "produtos": created_products
            },
            status=status.HTTP_201_CREATED
        )
    
@receiver(post_delete, sender=Product)
def apagar_imagem_produto(sender, instance, **kwargs):
    if instance.image:
        instance.image.delete(False)
