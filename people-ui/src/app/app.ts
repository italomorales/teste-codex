import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'people-ui';
  people: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<string[]>('http://localhost:5219/people')
      .subscribe(data => this.people = data);
  }
}
