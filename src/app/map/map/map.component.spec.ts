import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentCountry, MapComponent } from './map.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Country, MapService } from '../../core/services/map/map.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Apollo } from 'apollo-angular';
import { MapServiceMock } from '../../core/services/map/map.mock';
import { ApolloServiceMock } from '../../core/services/apollo.mock';
import * as Leaflet from 'leaflet';
import { GeoJsonObject } from 'geojson';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  const leafletEvent: Leaflet.LeafletMouseEvent = {
    propagatedFrom: {
      feature: {
        properties: {
          country_a3: "CHE"
        }
      }
    }
  } as Leaflet.LeafletMouseEvent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MapComponent,
        NgbTooltipModule,
        CommonModule
      ],
      providers: [
        { provider: MapService, useValue: MapServiceMock },
        { provide: Apollo, useValue: new ApolloServiceMock() },
        { provider: AuthService, useValue: {} },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should return Date to user age", () => {
    const date: Date = new Date("1992-06-01T08:57:17.152Z")
    expect(!isNaN(component.getUserAge(date))).toBeTrue();
    expect(component.getUserAge(date)).toBeGreaterThanOrEqual(0);
  });

  it("should set country data on currentCountry signal", () => {
    const country: Country = {
      name: { common: "Switzerland" },
      capital: ["Bern"],
      currencies: [
        {
          name: "Swiss Franc",
          symbol: "CHF"
        }
      ],
      flags: { png: "https://flagcdn.com/ch.svg" },
      continents: ["Europe"],
      population: 9000000,
      languages: ["German", "French", "Italian", "Romansh"],
      timezones: ["UTC+01:00", "UTC+02:00"],
      startOfWeek: "Monday",
      geoJson: {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [5.956, 47.808],
              [10.492, 47.808],
              [10.492, 45.818],
              [5.956, 45.818],
              [5.956, 47.808]
            ]
          ]
        },
        properties: {}
      } as GeoJsonObject
    };

    // @ts-expect-error - Deliberate access to a private method for test purposes
    component.setCurrentCountryData(leafletEvent, country);
    // @ts-expect-error - Deliberate access to a protected method for test purposes
    const currentCountry: CurrentCountry = component.currentCountry();
    
    expect(currentCountry.name).toBe("Switzerland");
    expect(currentCountry.capital).toBe("Bern");
    expect(currentCountry.flag).toBe("https://flagcdn.com/ch.svg");
    expect(currentCountry.currency).toBe("Swiss Franc (CHF)");
    expect(currentCountry.population).toBe(9000000);
    expect(currentCountry.continent).toBe("Europe");
    expect(currentCountry.countryA3Code).toBe("CHE");
    expect(currentCountry.languages).toBe("German, French, Italian, Romansh");
    expect(currentCountry.numberOfTimeZones).toBe(2);
    expect(currentCountry.timezones).toBe("UTC+01:00, UTC+02:00");
    expect(currentCountry.startOfWeek).toBe("Monday");
  });
});
