import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, Observable } from 'rxjs';
import { ParseHttpError } from './parse-http-error.service';
import { ApolloQueryResult } from '@apollo/client/core';
import { GeoJsonObject } from 'geojson';

export interface Country {
    name: string,
    capital: string[],
    currencies: {
            name: string,
            symbol: string
        }[],
    flag: string,
    continents: string[],
    population: number,
    languages: string[],
    timezones: string[],
    callingcode: string,
    startOfWeek: string,
    geoJson: GeoJsonObject
}

export interface CountriesResult {
    getCountrieData: Country[]
}

@Injectable({
    providedIn: "root"
})
export class MapService {
    private apollo: Apollo = inject(Apollo);
    private parseHttpError: ParseHttpError = inject(ParseHttpError);

    public getCountrieData(): Observable<ApolloQueryResult<CountriesResult>> {
        const GET_COUTRIES_DATA_QUERY = gql`
          query {
            getCountrieData {
              name
              capital
              currencies {
                name
                symbol
              }
              flag
              population
              continents
              languages
              geoJson
              callingcode
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