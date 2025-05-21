import { of } from "rxjs";

export class MapServiceMock {
    getCountriesData() {
        return of({
            data: {
                getCountriesData: []
            }
        })
    }
}