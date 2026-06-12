import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-generic-datagrid-column',
  standalone: true,
  templateUrl: './generic-datagrid-column.html',
  styleUrl: './generic-datagrid-column.css',
})
export class GenericDatagridColumn {
  @ViewChild(TemplateRef, { static: true }) template!: TemplateRef<any>;
}
