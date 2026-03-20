import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-page',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.css',
})
export class AdminPage {}
