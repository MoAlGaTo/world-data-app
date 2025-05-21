import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, Observable } from 'rxjs';
import { ParseHttpError } from '../parse-http-error.service';
import { ApolloQueryResult } from '@apollo/client/core';
import { GeoJsonObject } from 'geojson';

export interface Country {
  name: {
    common: string
  }
  capital: string[],
  currencies: {
    name: string,
    symbol: string
  }[],
  flags: {
    png: string
  },
  continents: string[],
  population: number,
  languages: string[],
  timezones: string[],
  startOfWeek: string,
  geoJson: GeoJsonObject
}

export interface CountriesResult {
  getCountriesData: Country[]
}

@Injectable({
  providedIn: "root"
})
export class MapService {
    private apollo: Apollo = inject(Apollo);
    private parseHttpError: ParseHttpError = inject(ParseHttpError);

    public getCountriesData(): Observable<ApolloQueryResult<CountriesResult>> {
      const GET_COUTRIES_DATA_QUERY = gql`
        query {
          getCountriesData {
            name {
              common
            }
            capital
            currencies {
              name
              symbol
            }
            flags {
              png
            }
            population
            continents
            languages
            geoJson
            timezones
            startOfWeek
          }
        }
      `;

    return this.apollo.query<CountriesResult>({
      query: GET_COUTRIES_DATA_QUERY,
    }).pipe(
      catchError((error) => this.parseHttpError.handleError(error))
    );
  }
}