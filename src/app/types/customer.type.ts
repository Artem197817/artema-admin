export interface Customer {
    id: number;
    name: string;
    lastName?: string;     // необязательное поле
    fatherName?: string;   // необязательное поле
    email: string;
    phone: string;
    comment?: string;      // необязательное поле
  }