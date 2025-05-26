import { Component } from '@angular/core';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  imports: [
    DashboardComponent,
    RouterOutlet
  ],
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
