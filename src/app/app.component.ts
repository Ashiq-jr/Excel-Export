// src/app/app.component.ts

import { Component } from '@angular/core';
import { ExcelService } from './excel.service';
import * as jQuery from 'jquery';
import * as $ from 'jquery'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  rowData: any[] = [];
  columnOrder: string[] = [];
  rangeInput: any = '';
  selectedRows: any[] = [];

  constructor(private excelService: ExcelService) { }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.excelService.readExcel(file).then(data => {
        // Assuming the first row contains headers
        this.columnOrder = Object.keys(data[0]);
        console.log(this.columnOrder);
        this.rowData = data;
      });
    }
  }
  downloadJson() {
    const jsonContent = JSON.stringify(this.rowData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tableData.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  onSubmit(): void {
    this.displayStyle = "none";
    console.log($('#inputData').val());
    this.rangeInput = $('#inputData').val()?.toString();
    this.downloadAsTextFile(this.rangeInput);
  }

  downloadAsTextFile(formData: any) {
    
    if (Array.isArray(this.rowData)) {
      const rangeInput = formData.toString();
      if (rangeInput) {
        const [start, end] = rangeInput.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end) && start <= end && start >= 1 && end <= this.rowData.length) {
          this.selectedRows = this.rowData.slice(start - 1, end);

        } else {
          console.error('Invalid range input. Please enter a valid range.');
        }
      }
      else {
        this.selectedRows = this.rowData;

      }
      const tableContent = this.selectedRows.map(row => `(${(Object.values(row) as string[]).map((cell: string) => `'${cell}'`).join(', ')})`).join(',\n');
      const blob = new Blob([tableContent], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'table_data.txt';
      a.click();
    } else {
      console.error('rowData is not in the expected format.');
    }
  }
  displayStyle = "none"; 
  
  openPopup() { 
    this.displayStyle = "block"; 
  } 
  closePopup() { 
    this.displayStyle = "none"; 
  } 
     
}
