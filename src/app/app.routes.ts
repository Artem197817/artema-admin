import { Routes } from '@angular/router';
import {LayoutComponent} from './shared/layout/layout.component';
import {MainComponent} from './shared/main/main.component';

export const routes: Routes = [
  {path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: MainComponent},
    ]}
];
