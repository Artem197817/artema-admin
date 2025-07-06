import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Customer } from '../../types/customer.type';
import {Order, OrderPayment, OrderStatus} from '../../types/order.type';
import {ActivatedRoute, Router} from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import { PaymentService } from '../../services/payment.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Status} from '../../types/status.types';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.scss'
})
export class CreateOrderComponent implements OnInit {
  @ViewChild('fileElem') fileElem!: ElementRef<HTMLInputElement>;

  protected createOrderForm: FormGroup;
  private orderId: number | null = null;
  protected customer: Customer | null = null;
  protected order: Order | null = null;
  protected payment: OrderPayment | null = null;
  protected isHistoryPaymentActive: boolean = false;
  protected filesToUpload: File[] = [];
  protected isDragOver = false;
  private customerId: number | null = null;


  constructor(private activatedRoute: ActivatedRoute,
              private orderService: OrderService,
              private customerService: CustomerService,
              private paymentService: PaymentService,
              private router: Router,
              private fb: FormBuilder,){

                const phonePattern = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;

                this.createOrderForm = this.fb.group({
                  customer: this.fb.group({
                    name: ['', [Validators.required]],
                    lastName: [''],
                    fatherName: [''],
                    phone: ['', [Validators.required, Validators.pattern(phonePattern)]],
                    email: ['', [Validators.required, Validators.email]],
                    comment: [''],
                  }),
                  order: this.fb.group({
                    orderName: [''],
                    orderPrice: [''],
                    orderDescription: [''],
                  }),
                  orderFile: [null] ,// поле для файла

                  payment: this.fb.group({
                    payment: [''],
                    comment: [''],
                  })
                });

              }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      let orderId = params.get('orderId');
      let customerId = params.get('customerId');
      console.log(orderId);
      if(orderId !== null){
        this.orderId = +orderId;
        this.loadOrder(this.orderId);
        return;
      }
      if(customerId !== null){
        this.customerId = +customerId;
        this.loadCustomer(this.customerId);
        return;
      }
      this.order = null;

    });
}
loadOrder(orderId: number){
  this.orderService.getOrderById(orderId)
  .subscribe((data: Order) => {

    this.order = data;
    if (this.order) {
      this.createOrderForm.get('order')?.patchValue({
        orderName: this.order.orderName || '',
        orderPrice: this.order.orderPrice || '',
        orderDescription: this.order.orderDescription || ''
      });
    }
    if (this.order && this.order.customerId) {
      this.loadCustomer(this.order.customerId);
    }
    if (this.order && this.order.orderId) {
      this.paymentService.getPaymentByOrderId(this.order.orderId)
        .subscribe((payment: OrderPayment) => {
          this.payment = payment;
        })
    }

  })
}
private loadCustomer(customerId: number){
  if(!customerId){return}
  this.customerService.getCustomerById(customerId)
        .subscribe((customer: Customer) => {
          this.customer = customer;
          if (this.customer) {
            this.createOrderForm.get('customer')?.patchValue({
              name: this.customer.name || '',
              lastName: this.customer.lastName || '',
              fatherName: this.customer.fatherName || '',
              phone: this.customer.phone || '',
              email: this.customer.email || '',
              comment: this.customer.comment || ''
            });
          }
        });
}

onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const files: File[] = Array.from(input.files);
    this.createOrderForm.patchValue({ orderFile: files });
  }
}
  submit() {
    const formValue = this.createOrderForm.value;
    const formData = new FormData();

    // Добавляем JSON-строки с заказчиком и заказом
    // Если customer не null — добавляем customerId
    if (this.customer && this.customer.id) {
      formValue.customer.id = this.customer.id;
    }

    // Формируем orderStatus в зависимости от наличия order
    let orderStatus: OrderStatus;

    if (this.order) {
      // orderId и текущий orderStatus из this.order
      formValue.order.orderId = this.order.orderId;
      orderStatus = this.order.orderStatus;
    } else {
      // Новый статус NEW с текущей датой
      orderStatus = {
        status: Status.NEW,
        dateOfChange: new Date().toISOString().split('T')[0], // формат 'YYYY-MM-DD'
        comment: 'Создан новый заказ'
      };
    }

    // Добавляем orderStatus в order
    formValue.order.orderStatus = orderStatus;

    // Добавляем customerId, если есть
    if (this.customer && this.customer.id) {
      formValue.order.customerId = this.customer.id;
    } else if (this.customerId) {
      // если customerId есть из параметров маршрута
      formValue.order.customerId = this.customerId;
    }

    // Добавляем заказчика и заказ в formData
    formData.append('customer', JSON.stringify(formValue.customer));
    formData.append('order', JSON.stringify(formValue.order));

    // Добавляем файлы (если есть)
    if (this.filesToUpload.length > 0) {
      this.filesToUpload.forEach(file => {
        formData.append('orderFiles', file, file.name);
      });
    }

    // Добавляем данные оплаты, если есть
    if (formValue.payment) {
      formData.append('payment', JSON.stringify(formValue.payment));
    }

    this.orderService.createOrder(formData).subscribe({
      next: response => {
       if(this.order && this.order.orderId) {
         this.router.navigate(['order', this.order.orderId]);
       }
        this.router.navigate(['orders'])
      },
      error: err => {
        console.error('Ошибка при создании заказа', err);
      }
    });
  }





protected changeIsHistoryPaymentActive() {
  this.isHistoryPaymentActive = !this.isHistoryPaymentActive;
}
onDragOver(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  this.isDragOver = true;
}

onDragLeave(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  this.isDragOver = false;
}

onDrop(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  this.isDragOver = false;
  if (event.dataTransfer?.files) {
    this.filesToUpload = this.filesToUpload.concat(Array.from(event.dataTransfer.files));
    this.updateOrderFileControl();
  }
}

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    this.filesToUpload = this.filesToUpload.concat(Array.from(input.files));
    this.updateOrderFileControl();
    input.value = '';
  }
}

removeFile(idx: number) {
  this.filesToUpload.splice(idx, 1);
  this.updateOrderFileControl();
}

updateOrderFileControl() {
  // Обновляем FormControl значением массива файлов
  this.createOrderForm.get('orderFile')?.setValue(this.filesToUpload.length ? this.filesToUpload : null);
  this.createOrderForm.get('orderFile')?.markAsDirty();
  this.createOrderForm.get('orderFile')?.updateValueAndValidity();
}

openFileDialog() {
  this.fileElem.nativeElement.click();
}

}
/**Для отправки данных формы и файла с Angular на сервер (Spring Boot), оптимальным решением будет использование DTO с файлом и аннотацией @ModelAttribute или @RequestPart на сервере. Это позволяет принимать как обычные поля, так и файл в одном запросе с типом multipart/form-data.

Пример DTO для Spring Boot
java
import org.springframework.web.multipart.MultipartFile;

public class OrderRequestDto {
    // Данные клиента
    private String name;
    private String lastName;
    private String fatherName;
    private String phone;
    private String email;
    private String comment;

    // Данные заказа
    private String orderName;
    private String orderPrice;
    private String orderDescription;

    // Файл
    private MultipartFile orderFile;

    // Геттеры и сеттеры
    // ...
}
Поле MultipartFile orderFile позволит принимать файл.

Пример контроллера
java
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @PostMapping(consumes = {"multipart/form-data"})
    public String createOrder(@ModelAttribute OrderRequestDto orderRequestDto) {
        // orderRequestDto.getOrderFile() — доступ к файлу
        // orderRequestDto.getName() и т.д. — доступ к полям формы
        return "Order created";
    }
}
Используйте @ModelAttribute (или @RequestPart для более сложных случаев).

Если нужно разделить JSON и файл (альтернативный способ)
Можно отправить JSON как строку и файл как отдельную часть:

java
@PostMapping(consumes = {"multipart/form-data"})
public String createOrder(
    @RequestPart("order") OrderRequestDto orderDto,
    @RequestPart("orderFile") MultipartFile orderFile) {
    // ...
}
В этом случае на фронте JSON сериализуется в Blob и добавляется в FormData как отдельная часть.

Пример отправки с Angular
typescript
const formData = new FormData();
formData.append('name', this.form.value.customer.name);
formData.append('lastName', this.form.value.customer.lastName);
formData.append('fatherName', this.form.value.customer.fatherName);
formData.append('phone', this.form.value.customer.phone);
formData.append('email', this.form.value.customer.email);
formData.append('comment', this.form.value.customer.comment);

formData.append('orderName', this.form.value.order.orderName);
formData.append('orderPrice', this.form.value.order.orderPrice);
formData.append('orderDescription', this.form.value.order.orderDescription);

if (this.form.value.orderFile) {
  formData.append('orderFile', this.form.value.orderFile);
}

this.http.post('/api/orders', formData).subscribe(...);
Не указывайте явно Content-Type — браузер сам выставит boundary для multipart/form-data. */
