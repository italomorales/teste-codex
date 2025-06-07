import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MugService, Mug } from './mug.service';

@Component({
  selector: 'app-mug-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mug-list.component.html'
})
export class MugListComponent implements OnInit {
  mugs: Mug[] = [];
  editingId: number | null = null;
  errorMessage = '';
  successMessage = '';

  form!: FormGroup;

  constructor(private service: MugService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      stock: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.getAll().subscribe({
      next: data => this.mugs = data,
      error: () => this.showError('Erro ao carregar canecas.')
    });
  }

  submit() {
    if (this.form.invalid) return;
    const data = this.form.value as any;
    this.clearMessages();
    if (this.editingId === null) {
      this.service.create(data).subscribe({
        next: () => {
          this.successMessage = 'Caneca adicionada com sucesso.';
          this.form.reset({ name: '', description: '', stock: 0 });
          this.load();
        },
        error: () => this.showError('Erro ao adicionar caneca.')
      });
    } else {
      this.service.update(this.editingId, data).subscribe({
        next: () => {
          this.successMessage = 'Caneca atualizada com sucesso.';
          this.cancelEdit();
          this.load();
        },
        error: () => this.showError('Erro ao atualizar caneca.')
      });
    }
  }

  edit(mug: Mug) {
    this.editingId = mug.id;
    this.form.setValue({
      name: mug.name,
      description: mug.description ?? '',
      stock: mug.stock
    });
    this.clearMessages();
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset({ name: '', description: '', stock: 0 });
  }

  delete(id: number) {
    if (!confirm('Deseja remover esta caneca?')) return;
    this.service.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Caneca removida com sucesso.';
        this.load();
      },
      error: () => this.showError('Erro ao remover caneca.')
    });
  }

  private showError(msg: string) {
    this.errorMessage = msg;
    setTimeout(() => this.errorMessage = '', 3000);
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
