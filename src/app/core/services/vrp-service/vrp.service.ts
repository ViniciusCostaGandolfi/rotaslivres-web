import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { VrpIn, SolutionDto, Vrp } from '../../interfaces/vrp/vrp';

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
    console.log(payload)
    return this.http.post<any>(this.apiUrl, payload);
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
