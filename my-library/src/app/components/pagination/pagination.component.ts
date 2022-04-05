import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage: number = 0;
  @Input() total: number = 0;

  @Output() goTo: EventEmitter<number> = new EventEmitter<number>();
  @Output() next: EventEmitter<number> = new EventEmitter<number>();
  @Output() previous: EventEmitter<number> = new EventEmitter<number>();

  public pages: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {}

  public onGoTo(page: number): void {
    this.goTo.emit(page);
  }

  public onNext(): void {
    this.next.emit(this.currentPage);
  }

  public onPrevious(): void {
    this.previous.next(this.currentPage);
  }
}
