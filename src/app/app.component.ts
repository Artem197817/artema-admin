import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


  export class AppComponent implements OnInit {
    title = 'artema-admin';
    constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
      this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          map(() => {
            let route = this.activatedRoute.firstChild;
            while (route?.firstChild) {
              route = route.firstChild;
            }
            return route;
          }),
          mergeMap(route => route?.data ?? [])
        )
        .subscribe(data => {
          if (data['backgroundImage']) {
            document.body.style.backgroundImage = `url('${data['backgroundImage']}')`;

          } else {
            document.body.style.backgroundImage = 'none';
          }
        });
    }
  }

