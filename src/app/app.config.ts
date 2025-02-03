import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideApollo } from 'apollo-angular';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { InMemoryCache } from '@apollo/client/cache';
import { ApolloLink } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
     
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const basic = setContext((operation, context) => ({
        headers: {
          'Accept': 'application/json'
        },
      }));
     
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const auth = setContext((operation, context) => {
        const token = localStorage.getItem('access_token');

        if (token === null) {
          return {};
        } else {
          return {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        }
      });

      return {
        link: ApolloLink.from([basic, auth, httpLink.create({ uri: 'http://localhost:3000/graphql' })]),
        cache: new InMemoryCache(),
      };
    })
  ]
};
