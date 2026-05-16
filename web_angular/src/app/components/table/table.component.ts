import { Component, Input } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-table',
  standalone: false,
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
}
