import { HttpBackend, HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, shareReplay, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SocketService } from '../socket/socket.service';
import { TokenService } from '../auth/services/token.service';

interface RefreshResponse {
  token: string;
  refreshToken: string;
}

let refreshRequest$: Observable<RefreshResponse> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const socketService = inject(SocketService);
  const httpBackend = inject(HttpBackend);

  const isAuthEndpoint =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/refresh');

  const token = tokenService.getToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status !== 401 || isAuthEndpoint) {
        return throwError(() => err);
      }

      const refreshToken = tokenService.getRefreshToken();
      if (!refreshToken) {
        tokenService.clearTokens();
        socketService.disconnect();
        void router.navigate(['/auth/login']);
        return throwError(() => err);
      }

      if (!refreshRequest$) {
        const refreshHttp = new HttpClient(httpBackend);
        refreshRequest$ = refreshHttp
          .post<RefreshResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
          .pipe(
            shareReplay(1),
            finalize(() => {
              refreshRequest$ = null;
            })
          );
      }

      return refreshRequest$.pipe(
        switchMap((refreshResponse) => {
          tokenService.setTokens(refreshResponse.token, refreshResponse.refreshToken);
          socketService.updateToken(refreshResponse.token);

          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${refreshResponse.token}` },
          });
          return next(retryReq);
        }),
        catchError((refreshErr) => {
          tokenService.clearTokens();
          socketService.disconnect();
          void router.navigate(['/auth/login']);
          return throwError(() => refreshErr);
        })
      );
    })
  );
};
