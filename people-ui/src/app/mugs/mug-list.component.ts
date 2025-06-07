import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, ICellRendererParams, GridApi, GridReadyEvent } from 'ag-grid-community';
import { MugService, Mug } from './mug.service';

@Component({
  selector: 'app-mug-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AgGridModule],
  templateUrl: './mug-list.component.html'
})
export class MugListComponent implements OnInit {
  mugs: Mug[] = [];
  editingId: number | null = null;
  errorMessage = '';
  successMessage = '';

  quickFilter = '';
  gridApi: GridApi | null = null;

  columnDefs: ColDef[] = [];
  defaultColDef: ColDef = { sortable: true, filter: true, resizable: true };

  form!: FormGroup;

  constructor(private service: MugService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      stock: [0, Validators.required]
    });

    this.columnDefs = [
      { field: 'name', headerName: 'Nome' },
      { field: 'description', headerName: 'Descrição' },
      { field: 'stock', headerName: 'Estoque' },
      {
        headerName: 'Ações',
        cellRenderer: (params: ICellRendererParams) => this.actionCellRenderer(params),
        sortable: false,
        filter: false
      }
    ];
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

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  onFilterTextBoxChanged(event: Event) {
    this.quickFilter = (event.target as HTMLInputElement).value;
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

  actionCellRenderer(params: ICellRendererParams) {
    const container = document.createElement('div');
    container.innerHTML = `
      <button class="btn btn-sm btn-primary me-1"><i class="bi bi-pencil"></i></button>
      <button class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button>
    `;
    const [editBtn, delBtn] = Array.from(container.querySelectorAll('button')) as HTMLButtonElement[];
    editBtn.addEventListener('click', () => this.edit(params.data as Mug));
    delBtn.addEventListener('click', () => this.delete((params.data as Mug).id));
    return container;
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
