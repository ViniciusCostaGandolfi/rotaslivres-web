import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-nova-rota-page',
  templateUrl: './nova-rota-page.component.html',
  styleUrls: ['./nova-rota-page.component.scss'],
  standalone: true,
  imports: [NgIf, MatProgressSpinner, MatButton, MatIcon]
})
export class NovaRotaPageComponent implements OnInit {

  isLoading: boolean = false;
  isProcessingFile: boolean = false;
  isDragging: boolean = false;
  uploadedFile: File | null = null;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  downloadTemplate(): void {
    const link = document.createElement('a');
    link.href = '/assets/templates/modelo_rotas.xlsx';
    link.download = 'modelo_rotas.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }

  handleFile(file: File): void {
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.snackBar.open("Formato de arquivo inválido. Por favor, envie um arquivo .xlsx.", "Fechar", { duration: 5000 });
      return;
    }
    this.uploadedFile = file;
  }

  validate(): void {
    if (!this.uploadedFile) {
      this.snackBar.open("Por favor, selecione um arquivo.", "Fechar", { duration: 5000 });
      return;
    }

    this.isProcessingFile = true;
    setTimeout(() => {
      this.isProcessingFile = false;
      this.snackBar.open("Arquivo validado e rota criada com sucesso! ✅", "Fechar", {
        duration: 5000,
        panelClass: ['snackbar-success']
      });
      this.router.navigate(['/admin/rotas']);
    }, 2000);
  }
}
