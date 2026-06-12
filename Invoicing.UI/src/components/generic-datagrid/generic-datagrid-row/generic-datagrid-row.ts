import { Component, Input, ContentChildren, QueryList } from '@angular/core';
import { GenericDatagridCell } from '../generic-datagrid-cell/generic-datagrid-cell';

@Component({
  selector: 'app-generic-datagrid-row',
  standalone: true,
  templateUrl: './generic-datagrid-row.html',
  styleUrl: './generic-datagrid-row.css',
})
export class GenericDatagridRow {
  @Input() item?: any;
  @ContentChildren(GenericDatagridCell) cells!: QueryList<GenericDatagridCell>;
}
