import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsumptionDataService {

  constructor(private httpClient: HttpClient) { }
	
	private baseUrl = 'https://n21p4p5y4j.execute-api.eu-central-1.amazonaws.com/dev/load_profiles/?sector=Haushalt&weekend_prod=No&day=Werktag'
	
	public sendGetRequest():Observable<any>{
		return this.httpClient.get(this.baseUrl);
	 }
	
}
