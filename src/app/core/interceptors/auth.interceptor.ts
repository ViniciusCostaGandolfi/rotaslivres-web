import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '../services/jwt-service/jwt-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const jwtService = inject(JwtService);
    const token = jwtService.getToken();
    const s3Url = 's3-s0c8c0880gso8s8gccco88ss.rotaslivres.com.br';

    if (token && !req.url.includes(s3Url)) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req);
};
