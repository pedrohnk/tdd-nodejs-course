# Autenticação com Facebook

## Dados necessários:
* Token de acesso

## Fluxo primário
1. Obter dados(nome, email, facebook id) da api do facebook.
2. Consultar se existe um usuario com o email recebido.
3. Criar uma conta para o usuario com os dados recebidos do Facebook.
4. Criar um token de acesso, a partir do ID do usuario.
5. Expiracao de 30 minutos no token
6. Retornar token de acesso gerado

## Fluxo: Usuario ja existe
1. Atualizar a conta do usuario com os dados recebidos do Facebook (facebook id e nome) - atualizar o nome somente caso o usuario da conta não tenha nome cadastrado.

## Fluxo de exceção: Token invalido ou expirado
1. Retornar um erro de autenticação.
