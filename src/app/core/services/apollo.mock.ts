import { of } from "rxjs";

export class ApolloServiceMock {
    query() {
        return of({ 
            data: { 
                getCountriesData: [] 
            } 
        });
    }

    mutate() {
        return of();
    }
}
