import { Component, HostListener, OnInit } from '@angular/core';
import {RouterLink} from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [
    RouterLink
  ],
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  protected isMenuActive = true;
  private windowWithBreakpoint = 860;

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.checkWidth(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkWidth((event.target as Window).innerWidth);
  }

  private checkWidth(width: number) {
    this.isMenuActive = width >= this.windowWithBreakpoint;
  }

  protected logout(){
    this.authService.logout();
  }

  changeIsMenuActive(){
    this.isMenuActive = !this.isMenuActive;
  }


}
