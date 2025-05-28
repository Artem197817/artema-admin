import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [
    RouterLink
  ],
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  protected isMenuActive = true;
}
