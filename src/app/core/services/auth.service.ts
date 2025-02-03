import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { map, Observable } from 'rxjs';

export interface User {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    birthDate: Date,
}

export interface LoginResponse {
    login: {
        access_token: string,
        user: Partial<User>
    }
}

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private apollo: Apollo = inject(Apollo);
    private router: Router = inject(Router);

    public signup(input: User): Observable<MutationResult<Partial<User>>> {
        const CREATE_USER_MUTATION = gql`
          mutation CreateUser($input: CreateUserInput!) {
            createUser(input: $input) {
              firstName
              lastName
              birthDate
            }
          }
        `;
    
        return this.apollo.mutate<Partial<User>>({
          mutation: CREATE_USER_MUTATION,
          variables: {
            input,
          },
        });
    }

    public whoAmI(): Observable<MutationResult<Partial<User>>> {
        const WHO_AM_I_QUERY = gql`
          query whoAmI {
            whoAmI {
              firstName
              lastName
              email
              birthDate
            }
          }
        `;
        
        return this.apollo.query<Partial<User>>({
          query: WHO_AM_I_QUERY,
        });
    }

    public signin(input: Pick<User, "email" | "password">): Observable<MutationResult<LoginResponse>> {
        const LOGIN_MUTATION = gql`
          mutation LoginInput($input: LoginInput!) {
            login(input: $input) {
              access_token
              user {
                firstName
                lastName
                birthDate
              }
            }
          }
        `;
    
        return this.apollo.mutate<LoginResponse>({
          mutation: LOGIN_MUTATION,
          variables: {
            input,
          },
        }).pipe(
            map((result: MutationResult<LoginResponse>) => {
                const token: string | undefined = result.data?.login.access_token;
                const user: Partial<User> | undefined = result.data?.login.user;
                if (token) {
                    this.setToken(token);
                }
                if (user) {
                    this.setUser(user);
                }
                return result;
            })
        );
    }

    private setToken(token: string): void {
      localStorage.setItem('access_token', token);
    }

    public getToken(): string {
      return localStorage.getItem('access_token') || "";
    }

    public get isAuthenticated(): boolean {
      return !!localStorage.getItem('access_token');
    }

    private setUser(user: Partial<User>): void {
      localStorage.setItem('user', JSON.stringify(user));
    }

    public getUser(): Partial<User> {
      return JSON.parse(localStorage.getItem('user') || "{}");
    }

    public logout(): void {
      localStorage.clear();
      this.router.navigate(["/signin"])
    }
}