import { Component, EventEmitter, Input, Output, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { NgFor, NgIf, NgClass, NgTemplateOutlet } from '@angular/common';
import { GenericDatagridColumn } from './generic-datagrid-column/generic-datagrid-column';
import { GenericDatagridColumns } from './generic-datagrid-columns/generic-datagrid-columns';
import { GenericDatagridRow } from './generic-datagrid-row/generic-datagrid-row';
import { PaginatedList } from '../../services/paginated-list';

@Component({
  selector: 'app-generic-datagrid',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, NgTemplateOutlet],
  templateUrl: './generic-datagrid.html',
  styleUrl: './generic-datagrid.css',
})
export class GenericDatagrid implements AfterContentInit {
  @Input() data?: PaginatedList<any>;
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  @ContentChildren(GenericDatagridColumns) columnsWrapper!: QueryList<GenericDatagridColumns>;
  @ContentChildren(GenericDatagridRow) rows!: QueryList<GenericDatagridRow>;

  columns?: QueryList<GenericDatagridColumn>;

  ngAfterContentInit(): void {
    if (this.columnsWrapper.first) {
      this.columns = this.columnsWrapper.first.columns;
    }
  }

  onNext(): void {
    this.next.emit();
  }

  onPrevious(): void {
    this.previous.emit();
  }

  get totalItems(): number {
    return this.rows?.length || 0;
  }
}

// Re-export all components for convenience
export { GenericDatagridColumn } from './generic-datagrid-column/generic-datagrid-column';
export { GenericDatagridColumns } from './generic-datagrid-columns/generic-datagrid-columns';
export { GenericDatagridCell } from './generic-datagrid-cell/generic-datagrid-cell';
export { GenericDatagridRow } from './generic-datagrid-row/generic-datagrid-row';
