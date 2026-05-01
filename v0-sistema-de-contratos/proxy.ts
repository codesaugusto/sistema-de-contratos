import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy handler para proteção de rotas (substitui middleware.ts no Next.js 16+).
 *
 * Lê o cookie "contratos-auth" (definido no login via authApi).
 * - Usuário não autenticado tentando acessar rota protegida → redireciona para /login
 * - Usuário autenticado tentando acessar /login → redireciona para /
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has("contratos-auth");

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Redireciona para /login se não autenticado e tentando acessar rota protegida
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redireciona para / se já autenticado e tentar acessar /login ou /register
  if (isAuthenticated && isPublicRoute) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica o proxy em todas as rotas exceto:
     * - _next/static   (arquivos estáticos do Next.js)
     * - _next/image    (otimização de imagens)
     * - favicon.ico
     * - arquivos de assets públicos (png, jpg, svg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js)$).*)",
  ],
};
