import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { VrpIn, SolutionDto, Vrp, ClientDto } from '../../interfaces/vrp/vrp';

@Injectable({
  providedIn: 'root'
})
export class VrpService {
  private apiUrl = `${environment.ROTASLIVRES_API}/api/logistic/vrp`;

  constructor(private http: HttpClient) { }

  getSolutions(): Observable<SolutionDto[]> {
    return this.http.get<SolutionDto[]>(this.apiUrl);
  }

  getSolution(id: string | number): Observable<SolutionDto> {
    return this.http.get<SolutionDto>(`${this.apiUrl}/${id}`);
  }

  createSolution(payload: VrpIn): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }


  fetchCepData(cep: string): Observable<any> {
    return this.http.get<any>(`${environment.ROTASLIVRES_API}/api/v1/geo/cep/${cep}`);
  }

  searchAddress(query: string): Observable<any> {
    return this.http.get<any>(`${environment.ROTASLIVRES_API}/api/v1/geo/search?q=${encodeURIComponent(query)}`);
  }

  enrichClientsBulk(clients: ClientDto[]): Observable<ClientDto[]> {
    return this.http.post<ClientDto[]>(`${environment.ROTASLIVRES_API}/api/v1/geo/clients/enrich`, clients);
  }

  deleteSolution(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  retrySolution(id: number | string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, {});
  }

  fetchVrpJson(url: string): Observable<Vrp> {
    return this.http.get<Vrp>(url);
  }
}
