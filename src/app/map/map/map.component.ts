import { ChangeDetectorRef, Component, inject, OnInit, signal, ViewEncapsulation, WritableSignal } from '@angular/core';
import { CountriesResult, Country, MapService } from '../../core/services/map.service';
import { ApolloQueryResult } from '@apollo/client/core';
import { Subject, throttleTime } from 'rxjs';
import * as Leaflet from 'leaflet';
import "leaflet-providers";
import "leaflet-sidebar-v2";
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, User } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

declare module 'leaflet' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace tileLayer {
    function provider(name: string, options?: L.TileLayerOptions): L.TileLayer;
  }
}

interface CurrentCountry {
  name: string,
  capital: string,
  flag: string,
  currency: string,
  population: number,
  continent: string,
  countryA3Code: string,
  languages: string,
  countryCode: string,
  numberOfTimeZones: number,
  timezones: string,
  startOfWeek: string,
}

@Component({
  selector: 'app-map',
  imports: [NgbTooltipModule, CommonModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {
  private changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
  private mapService: MapService = inject(MapService);
  private authService: AuthService = inject(AuthService);
  protected user: Partial<User> = this.authService.getUser();
  protected userAge: number = this.getUserAge(this.user.birthDate as Date);
  protected Map: Leaflet.Map;
  protected currentCountry: WritableSignal<CurrentCountry| null> = signal(null);
  private lastLayer: Leaflet.LeafletMouseEvent | null = null;
  private mapClickEvent$ = new Subject<boolean>();

  ngOnInit(): void {
    this.setMap();
    this.setSidebarOnMap();
    this.setMapClickEvent();
    this.changeDetector.detectChanges();
    this.mapService.getCountrieData().subscribe(
      (countries: ApolloQueryResult<CountriesResult>) =>  {
        this.setCountryDataOnMap(countries.data.getCountrieData);
        this.changeDetector.detectChanges();
        setTimeout(() => {
          this.changeDetector.detach();
        }, 100);
      }
    );
  }

  private setMap(): void {
    this.Map = Leaflet.map('map', {
      zoomControl: false,
      minZoom: 3,
      maxZoom: 7,
    }).setView([51.505, -0.09], 3);

    Leaflet.control.zoom({
      position: 'topright'
    }).addTo(this.Map);

    Leaflet.tileLayer.provider('Stadia.AlidadeSmoothDark', {
      attribution: "World Data © Learn more about our world"
    }).addTo(this.Map);
  }

  private setSidebarOnMap(): void {
    Leaflet.control.sidebar({
      autopan: false,
      closeButton: false,
      container: 'sidebar',
      position: 'left',
    }).addTo(this.Map).open("home");
  }

  private setMapClickEvent(): void {
    this.mapClickEvent$.pipe(
      throttleTime(300),
    ).subscribe({
      next: (mapClickEvent$) => {
        if (mapClickEvent$) {
          this.currentCountry.set(null);
          this.changeDetector.detectChanges()
          if (this.lastLayer) {
            this.setDefaultLayerStyle(this.lastLayer);
          }
        }
      }
    });

    this.Map.on("click", () => {
      this.mapClickEvent$.next(true);
    });
  }

  private setCountryDataOnMap(countries: Country[]): void {
    for (const country of countries) {
      if (country.geoJson) {
        const geoJsonLayer = Leaflet.geoJSON(
          country.geoJson,
          { style: () => ({ fillColor: "blue", color: "#6e166b" }) }
        );

        geoJsonLayer
          .addTo(this.Map)
          .on("mouseover", (e: Leaflet.LeafletMouseEvent) => this.onLayerMouseOver(e))
          .on("click", (e: Leaflet.LeafletMouseEvent) => this.onLayerClick(e, country))
          .on("mouseout", (e: Leaflet.LeafletMouseEvent) => this.onLayerMouseOut(e));
      }
    }
  }

  private onLayerMouseOver(event: Leaflet.LeafletMouseEvent): void {
    this.setSelectedLayerStyle(event);
  }

  private onLayerClick(event: Leaflet.LeafletMouseEvent, country: Country): void {
    this.mapClickEvent$.next(false);
    if (this.currentCountry()?.countryA3Code &&
        this.currentCountry()?.countryA3Code !== event.propagatedFrom.feature.properties.country_a3) {
      this.setDefaultLayerStyle(this.lastLayer as Leaflet.LeafletMouseEvent)
    }
    
    this.lastLayer = event;
    this.setSelectedLayerStyle(event);

    this.setCurrentCountryData(event, country);

    this.changeDetector.detectChanges();
  }

  private setCurrentCountryData(event: Leaflet.LeafletMouseEvent, country: Country) {
    this.currentCountry.set({
      name: country.name,
      capital: country.capital[0],
      flag: country.flag,
      currency: country.currencies.length ? `${country.currencies[0].name} (${country.currencies[0].symbol})` : "",
      population: country.population,
      continent: country.continents.join(", "),
      languages: country.languages.join(", "),
      numberOfTimeZones: country.timezones.length,
      timezones: country.timezones.join(", "),
      countryCode: country.callingcode,
      startOfWeek: country.startOfWeek,
      countryA3Code: event.propagatedFrom.feature.properties.country_a3,
    });
  }

  private onLayerMouseOut(event: Leaflet.LeafletMouseEvent): void {
    if (this.currentCountry()?.countryA3Code !== event.propagatedFrom.feature.properties.country_a3) {
      this.setDefaultLayerStyle(event)
    }
  }

  private setDefaultLayerStyle(event: Leaflet.LeafletMouseEvent): void {
    event.propagatedFrom.setStyle({ fillColor: "blue", color: "#6e166b" });
  }

  private setSelectedLayerStyle(event: Leaflet.LeafletMouseEvent): void {
    event.propagatedFrom.setStyle({ fillColor: "white", color: "white" });
  }

  private getUserAge(dateOfBirth: Date) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Adjust if the anniversary has not yet passed this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
  }

  protected logoutButtonHover() {
    this.authService.logout();
  }
}
