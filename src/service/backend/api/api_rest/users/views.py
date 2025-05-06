from rest_framework import viewsets, filters, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import User
from .serializers import UserSerializer , CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from api_rest.products.models import Product
from api_rest.products.serializers import ProductSerializer
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [] 
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['name', 'created_at']
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    # Personalizando o método GET
    def get_queryset(self):
        queryset = super().get_queryset()
        email = self.request.query_params.get('email')

        if email:
            queryset = queryset.filter(email=email)
    
        return queryset

    # Atualizando o usuário com lógica adicional
    

    def perform_update(self, serializer):
        user = self.request.user
        instance = self.get_object()

            # Verificação de autenticação do usuário
        if not user.is_authenticated:
            raise NotAuthenticated("Você precisa estar autenticado para editar um produto.")
            
            # Verificação se o usuário pode editar o produto
        if user.role == 'seller' and instance.created_by != user:
            raise PermissionDenied("Você só pode editar produtos criados por você.")
            
        if user.role not in ('seller', 'admin'):
            raise PermissionDenied("Apenas sellers ou admins podem editar produtos.")

        print("Dados recebidos:", self.request.data)  # Para verificar os dados que estão chegando

            # Filtra os dados para manter apenas os campos que foram modificados
        updated_data = {}
        for field, value in self.request.data.items():
                # Verifica se o valor enviado é diferente do valor atual no banco de dados
            if getattr(instance, field, None) != value:
                updated_data[field] = value

            # Se não houver dados atualizados, lança um erro
        if not updated_data:
            raise PermissionDenied("Nenhuma alteração detectada no produto.")

            # Atualiza o produto com os dados filtrados
        for field, value in updated_data.items():
            setattr(instance, field, value)

            # Salva as alterações no produto
        instance.save()

            # Atualiza o serializer com os dados mais recentes
        serializer = self.get_serializer(instance, data=updated_data, partial=True)  # Passa o partial=True aqui
        serializer.is_valid(raise_exception=True)  # Validar os dados
        return serializer



    # Excluindo o usuário com controle de permissões
    def perform_destroy(self, instance):
        # Verifica se o usuário está tentando excluir a si mesmo
        if self.request.user != instance:
            raise PermissionDenied("Você não tem permissão para excluir esse usuário.")
        super().perform_destroy(instance)

    # Ação personalizada: por exemplo, mudar a senha
    @action(detail=True, methods=['post'])
    def change_password(self, request, pk=None):
        user = self.get_object()
        new_password = request.data.get('new_password')

        if not new_password:
            return Response({"detail": "Nova senha é necessária."}, status=400)

        # Atualiza a senha do usuário
        user.set_password(new_password)
        user.save()
        return Response({"detail": "Senha alterada com sucesso."}, status=200)
    
    
    
    @action(detail=True, methods=['get'])
    def vendas(self, request, pk=None):
        user = self.get_object()
        
        # Verifica se o usuário é um vendedor
        if user.role != 'seller':
            return Response({"detail": "Usuário não é um vendedor."}, status=403)
        
        # Filtra os produtos do vendedor
        produtos_nao_comprados = Product.objects.filter(created_by=user, purchased_by__isnull=True)
        produtos_comprados = Product.objects.filter(created_by=user, purchased_by__isnull=False)
        
        # Combina os dois conjuntos de produtos
        produtos = list(produtos_nao_comprados) + list(produtos_comprados)
        
        # Serializa os produtos combinados
        serializer = ProductSerializer(produtos, many=True)
        
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def minhas_compras(self, request):
        user = request.user

        if user.role != 'user':
            return Response({"detail": "Usuário não é um comprador."}, status=403)

        produtos_comprados = user.purchased_products.all()

        if not produtos_comprados.exists():
            return Response([], status=status.HTTP_200_OK)  # Lista vazia

        serializer = ProductSerializer(produtos_comprados, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def uploadprofile(self, request, pk=None):
        print('FILES RECEBIDOS:', request.FILES)
        profile_picture = request.FILES.get('profile_picture')
        
        if profile_picture:
            print('Imagem recebida:', profile_picture)
            print('Nome da imagem:', profile_picture.name)
            print('Tipo da imagem:', profile_picture.content_type)
            print('Tamanho da imagem (em bytes):', profile_picture.size)

            user = self.get_object()
            user.profile_picture = profile_picture
            user.save()

            return Response({"detail": "Imagem de perfil atualizada com sucesso."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Nenhuma imagem de perfil enviada."}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "email e senha são obrigatórios"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "email ou senha inválidos."}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.check_password(password):
            return Response({"error": "email ou senha inválidos."}, status=status.HTTP_401_UNAUTHORIZED)

        # Gerar o token JWT
        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'name': user.name,
                'role': user.role,
            }
        })
        
    @action(detail=False, methods=['get'], url_path='get_cart')
    def get_cart(self, request, *args, **kwargs):
        """ Retorna os produtos no carrinho do usuário autenticado """
        user = request.user
        cart = user.cart.all()
        products_data = ProductSerializer(cart, many=True).data
        return Response({"cart": products_data})

    @action(detail=False, methods=['post'], url_path='adicionar-ao-carrinho')
    def add_to_cart(self, request, *args, **kwargs):
        """ Adiciona um produto ao carrinho do usuário """
        user = request.user  # Obtém o usuário autenticado
        product_id = request.data.get('product_id')

        if not product_id:
            return Response({"detail": "ID do produto é necessário."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"detail": "Produto não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        user.cart.add(product)  # Adiciona o produto ao carrinho
        return Response({"detail": "Produto adicionado ao carrinho!"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='remover-do-carrinho')
    def remove_from_cart(self, request, *args, **kwargs):
        """ Remove um produto do carrinho do usuário """
        user = request.user  # Obtém o usuário autenticado
        product_id = request.data.get('product_id')

        if not product_id:
            return Response({"detail": "ID do produto é necessário."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"detail": "Produto não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        user.cart.remove(product)  # Remove o produto do carrinho
        return Response({"detail": "Produto removido do carrinho!"}, status=status.HTTP_200_OK)   
            
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer