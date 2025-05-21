import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideApollo } from 'apollo-angular';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { InMemoryCache } from '@apollo/client/cache';
import { ApolloLink } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
import { environment } from './environment/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
     
      const basic = setContext(() => ({
        headers: {
          'Accept': 'application/json'
        },
      }));

      return {
        link: ApolloLink.from([
          basic,
          httpLink.create({
            uri: environment.apiUrl,
            withCredentials: true // to send cookie HTTP-only
          })]),
        cache: new InMemoryCache(),
      };
    })
  ]
};
