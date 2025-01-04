import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { COOKIE_KEY } from "./dataEnv/dataEnv";
import { validateToken } from "./api/apiUser";

// Define las rutas públicas donde los usuarios no autenticados pueden navegar
const publicRoutes = ["/", "/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verifica si el usuario está autenticado
  const isAuthenticated = !!request.cookies.get(COOKIE_KEY);

  // Permitir el acceso a rutas públicas sin autenticación
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirigir a "/login" si no está autenticado
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);

    return NextResponse.redirect(loginUrl);
  }

  //validar token
  if (isAuthenticated) {
    const token = request.cookies.get(COOKIE_KEY);
    //console.log('inicia validacion de token en el Middleware:..', token);
    const response: any = await validateToken(token?.value);

    //console.log("response validate token: ", response);

    const { isValid } = response;

    if (response && isValid) {
      return NextResponse.next();
    } else {
      console.log("token invalido, redirigiendo a login", response);

      const loginUrl = new URL("/login", request.url);

      return NextResponse.redirect(loginUrl);
    }
  }

  // Permitir el acceso a rutas protegidas si está autenticado
  return NextResponse.next();
}

// Configura las rutas donde se aplica el middleware
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
