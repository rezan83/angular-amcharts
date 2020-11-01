import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsumptionDataService {
  constructor(private httpClient: HttpClient) {}

  private baseUrl = ({ weekend_prod, sector }): String =>
    `https://n21p4p5y4j.execute-api.eu-central-1.amazonaws.com/dev/load_profiles/?sector=${sector}&weekend_prod=${weekend_prod}&day=`;

  public GetWerktag(chartInputs): Observable<any> {
    return this.httpClient.get(this.baseUrl(chartInputs) + 'Werktag');
  }
  public GetWochenende(chartInputs): Observable<any> {
    return this.httpClient.get(this.baseUrl(chartInputs) + 'Wochenende');
  }
}
