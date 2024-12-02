import { Component } from '@angular/core';
import { User } from '../model/user';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  users: User[] = [];
  userForm! : FormGroup;
  private userSubscripcion : Subscription | undefined; 
  selectedUser: User | null = null;
  isEditMode: boolean = false;
  newUser : User = { id: 0, nombre: '', apellido: '', email: '' };

  constructor(
    private formBuilder : FormBuilder,
    private userService : UserService
  ){}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(user => {
        this.users = user;
      });

    this.userForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    if(this.userSubscripcion){
      this.userSubscripcion.unsubscribe();
    }
  }

  getProducts(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data; // Si hay datos, se llenan los empleados.
      },
    });
  }

  openForm(user?: User): void {
    if (user) {
      this.selectedUser = { ...user }; // Clonar el empleado para evitar modificar el original
      this.isEditMode = true; // Modo edición
    } else {
      this.selectedUser = { id: 0, nombre: '', apellido: '', email: '' }; // Valores por defecto
      this.isEditMode = false; // Modo creación
    }
  }

  saveUser(): void {
    if (!this.selectedUser) return;

    if (this.isEditMode) {
      // Actualizar empleado
      this.userService.editarUser(this.selectedUser.id, this.selectedUser).subscribe({
        next: (updatedUser) => {
          // verifica que el id seleccionado es igual al del producto de la tabla
          const index = this.users.findIndex((u) => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          // oculta el formulario una vez actualizado el producto
          this.selectedUser = null;
          this.isEditMode = false;
        },
      });
    } else {
      // Crear nuevo producto
      this.userService.crearUser(this.selectedUser).subscribe({
        next: (createdUser) => {
          this.users.push(createdUser);
          this.selectedUser = null;
        },
      });
    }
  }

  cancelEditing(): void {
    this.selectedUser = null; // Cierra el formulario
    this.isEditMode = false;
  }

  eliminarUser(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este Empleado?')) {
      this.userService.eliminarUser(id).subscribe({
        next: () => {
          // Eliminar el empleado de la lista local
          this.users = this.users.filter((user) => user.id !== id);
          console.log('Empleado eliminado con éxito');
        },
      });
    }
  }
}
