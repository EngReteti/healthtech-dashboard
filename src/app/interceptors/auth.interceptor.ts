import { HttpInterceptorFn } from '@angular/common/http';

// An interceptor is a function that runs on EVERY outgoing HTTP request,
// before it actually leaves the app - similar in spirit to our
// JwtAuthFilter on the backend, but running on the frontend side instead
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // Retrieve whatever token we saved during login
  const token = localStorage.getItem('token');

  // If we have a token, clone the outgoing request and add the
  // Authorization header to it - requests are immutable in Angular,
  // so we can't just modify "req" directly, we make a modified copy
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // No token available (e.g. this IS the login request itself) -
  // just send the request through unchanged
  return next(req);
};
