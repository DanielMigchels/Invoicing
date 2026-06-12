import { Component, ContentChildren, QueryList } from '@angular/core';
import { GenericDatagridColumn } from '../generic-datagrid-column/generic-datagrid-column';

@Component({
  selector: 'app-generic-datagrid-columns',
  standalone: true,
  templateUrl: './generic-datagrid-columns.html',
  styleUrl: './generic-datagrid-columns.css',
})
export class GenericDatagridColumns {
  @ContentChildren(GenericDatagridColumn) columns!: QueryList<GenericDatagridColumn>;
}
