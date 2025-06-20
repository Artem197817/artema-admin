import { Component } from '@angular/core';
import { Customer } from '../../types/customer.type';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {

  protected customers: Customer[] = [];
}
