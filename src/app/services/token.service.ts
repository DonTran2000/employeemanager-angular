import { Inject, Injectable } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TokenService {
    private apiServerUrl = environment.apiBaseUrl;
    private apiRefreshToken = `${this.apiServerUrl}/employeemanager/refreshToken`;

    private readonly TOKEN_KEY = 'access_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private jwtHelperService = new JwtHelperService();
    localStorage?: Storage;
    sessionStorage?: Storage;

    constructor(@Inject(DOCUMENT) private document: Document, private http: HttpClient) {
        this.localStorage = document.defaultView?.localStorage;
    }
    //getter/setter
    getTokenExpirationTime(): number {
        const token = this.getToken();
        if (token) {
            const expirationDate = this.jwtHelperService.getTokenExpirationDate(token);
            if (expirationDate) {
                return expirationDate.getTime();
            }
        }
        return 0;
    }

    getRemainingTime(): number {
        const expirationTime = this.getTokenExpirationTime();
        const currentTime = new Date().getTime();
        return expirationTime - currentTime;
    }

    getToken(): string | null {
        // Ưu tiên lấy token từ sessionStorage
        return sessionStorage.getItem(this.TOKEN_KEY) || localStorage.getItem(this.TOKEN_KEY);
    }

    getRefreshToken(): string {
        debugger
        return this.localStorage?.getItem(this.REFRESH_TOKEN_KEY) ?? '';
    }

    setToken(token: string): void {
        debugger
        this.localStorage?.setItem(this.TOKEN_KEY, token);
    }

    setRefreshToken(refreshToken: string): void {
        debugger
        this.localStorage?.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }

    getUserId(): number {
        debugger
        let token = this.getToken();
        if (!token) {
            return 0;
        }
        let userObject = this.jwtHelperService.decodeToken(token);
        return 'sub' in userObject ? parseInt(userObject['sub']) : 0;
    }

    removeToken(): void {
        this.localStorage?.removeItem(this.TOKEN_KEY);
        this.localStorage?.removeItem(this.REFRESH_TOKEN_KEY);
    }

    isTokenExpired(): boolean {
        if (this.getToken() == null) {
            return false;
        }
        return this.jwtHelperService.isTokenExpired(this.getToken()!);
    }

    // Refresh token method
    refreshToken(refreshToken: string): Observable<any> {
        debugger
        const apiRefreshToken = this.apiRefreshToken;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const body = { refresh_token: refreshToken };

        return this.http.post(apiRefreshToken, body, { headers }).pipe(
            tap((response: any) => {
                // Handle response, e.g., update token in local storage
                this.setToken(response.token);
                this.setRefreshToken(response.refresh_token);
            })
        )
    }
}
