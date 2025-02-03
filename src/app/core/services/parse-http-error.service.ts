import { inject, Injectable } from "@angular/core";
import { ApolloError } from "@apollo/client/errors";
import { Observable, throwError } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: "root"
})
export class ParseHttpError {
    private authService: AuthService = inject(AuthService);

    public handleError(error: ApolloError): Observable<never> {    
        if (error.message === "Unauthorized") {
            this.authService.logout();
        }
        return throwError(() => new Error(error.message));
    }
}
