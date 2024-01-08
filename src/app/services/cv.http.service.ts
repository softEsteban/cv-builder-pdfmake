import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CvHttpService {

  apiKey = environment.apiKey;

  constructor(private http: HttpClient) { }

  async getSkills(skill: string): Promise<string[]> {
    const headers = new HttpHeaders().set('apiKey', this.apiKey);
    const response = await lastValueFrom(
      this.http.get<string[]>(`https://api.promptapi.com/skills?q=${skill}`, { headers })
    );
    return response;
  }
}
