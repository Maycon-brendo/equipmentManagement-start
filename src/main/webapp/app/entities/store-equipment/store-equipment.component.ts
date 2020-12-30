import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IStoreEquipment } from 'app/shared/model/store-equipment.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { StoreEquipmentService } from './store-equipment.service';
import { StoreEquipmentDeleteDialogComponent } from './store-equipment-delete-dialog.component';

@Component({
  selector: 'jhi-store-equipment',
  templateUrl: './store-equipment.component.html',
})
export class StoreEquipmentComponent implements OnInit, OnDestroy {
  storeEquipments: IStoreEquipment[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  @Input()
  storeId: number | undefined;

  constructor(
    protected storeEquipmentService: StoreEquipmentService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks
  ) {
    this.storeEquipments = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  isValidStoreId(): boolean {
    return this.storeId != null && this.storeId > 0;
  }

  loadData(): void {
    if (this.isValidStoreId()) {
      this.loadById();
    } else {
      this.loadAll();
    }
  }

  loadAll(): void {
    this.storeEquipmentService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<IStoreEquipment[]>) => this.paginateStoreEquipments(res.body, res.headers));
  }

  loadById(): void {
    this.storeEquipmentService
      .query({
        'storeId.equals': this.storeId,
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<IStoreEquipment[]>) => this.paginateStoreEquipments(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.storeEquipments = [];
    this.loadData();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadData();
  }

  ngOnInit(): void {
    this.loadData();
    this.registerChangeInStoreEquipments();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IStoreEquipment): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInStoreEquipments(): void {
    this.eventSubscriber = this.eventManager.subscribe('storeEquipmentListModification', () => this.reset());
  }

  delete(storeEquipment: IStoreEquipment): void {
    const modalRef = this.modalService.open(StoreEquipmentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.storeEquipment = storeEquipment;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateStoreEquipments(data: IStoreEquipment[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.storeEquipments.push(data[i]);
      }
    }
  }
}
