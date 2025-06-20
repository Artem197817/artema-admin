import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Customer } from '../../types/customer.type';
import { Order, OrderPayment } from '../../types/order.type';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import { PaymentService } from '../../services/payment.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  orderId: number | null = null;
  protected customer: Customer | null = null;
  protected order: Order | null = null;
  protected payment: OrderPayment | null = null;
  protected isHistoryPaymentActive: boolean = false;
  filesToUpload: File[] = [];
  isDragOver = false;
  customerId: number | null = null;


  constructor(private activatedRoute: ActivatedRoute,
              private orderService: OrderService,
              private customerService: CustomerService,
              private paymentService: PaymentService,
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
    this.activatedRoute.paramMap.subscribe(params => {
      let orderId = params.get('orderId');
      let customerId = params.get('customerId');
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
    console.log(this.order)
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
        })
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

  // Добавляем текстовые поля
  formData.append('customer', JSON.stringify(formValue.customer));
  formData.append('order', JSON.stringify(formValue.order));

  // Добавляем файл
  if (formValue.orderFile) {
    formData.append('orderFile', formValue.orderFile);
  }

  // Отправляем formData через HttpClient
 // this.http.post('/api/orders', formData).subscribe(...);
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
