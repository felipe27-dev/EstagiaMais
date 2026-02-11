import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  // Intercepta requisições POST para /login
  http.post('*/login', async ({ request }) => {
    const { email, password } = await request.json();

    // Simula um delay de rede para testar seus loadings
    await delay(1500);

    // Regra de sucesso simulada
    if (email === 'admin@estagia.com' && password === '123456') {
      return HttpResponse.json({
        user: { id: '1', name: 'Felipe Sênior', email: 'admin@estagia.com' },
        token: 'token-fake-jwt-estagia-plus',
      }, { status: 200 });
    }

    // Regra de erro (Credenciais inválidas)
    return new HttpResponse(null, {
      status: 401,
      statusText: 'Credenciais inválidas',
    });
  }),
];