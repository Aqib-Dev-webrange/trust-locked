// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
export function middleware() {
//   // const { pathname } = request.nextUrl;
  
//   // // Check if user is authenticated (you'd check cookies/tokens here)
//   // const isAuthenticated = false; // Replace with actual auth check
  
//   // // Protect dashboard routes
//   // if (pathname.startsWith('/dashboard') && !isAuthenticated) {
//   //   return NextResponse.redirect(new URL('/auth/login', request.url));
//   // }
  
//   // // Redirect authenticated users away from auth pages
//   // if (pathname.startsWith('/auth') && isAuthenticated) {
//   //   return NextResponse.redirect(new URL('/dashboard', request.url));
//   // }
  
//   // return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};


// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { supabase } from './lib/supabase';

// export function middleware(request: NextRequest) {
//   const token = supabase.auth.getSession().then(session => session.data.session?.access_token) || null;
//   // console.log('Middleware - Access Token:', token); 

//   // const isAdmin = supabase.auth.getUser().then(user => user.data.user?.user_metadata?.isAdmin) || false;
//   // if (!isAdmin) {
//   //   return NextResponse.redirect(new URL('/auth/login', request.url));
//   // }
//   const { pathname } = request.nextUrl;
//   const isAuthenticated = !!token;

//   if (pathname.startsWith('/admin') && !isAuthenticated) {
//     return NextResponse.redirect(new URL('/auth/login', request.url));
//   }

//   if (pathname.startsWith('/auth') && isAuthenticated) {
//     return NextResponse.redirect(new URL('/admin', request.url));
//   }

//   return NextResponse.next();
// }
// export const config = {
//   matcher: ['/admin/:path*', '/auth/:path*'],
// };