import { MathdesignService } from 'src/app/@core/service/mathdesign.service';
import { MajorService } from './../../../../@core/service/major.service';
import { MathDesign } from './../../../../@core/model/base.mathDesign';
import { TableStudentComponent } from './../../student/table-student/table-student.component';
import { ClassService } from './../../../../@core/service/class.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { concatMap, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { Block } from 'src/app/@core/model/block.model';
import { Major } from 'src/app/@core/model/major.model';
import { BlockService } from 'src/app/@core/service/block.service';
import { Class } from 'src/app/@core/model/base.class';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableClassComponent } from '../../class/table-class/table-class.component';
import { HelperService } from 'src/app/@core/service/helper.service';
import { UserService } from 'src/app/@core/service/user.service';
import { User } from 'src/app/@core/model/user.model';
import { TableMathdesignComponent } from '../../mathdesign/table-mathdesign/table-mathdesign.component';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-block-detail',
  templateUrl: './block-detail.component.html',
  styleUrls: ['./block-detail.component.scss']
})
export class BlockDetailComponent implements OnInit, OnDestroy {

  blockDialog!: boolean;

  block!: Block;

  majors!: Major[];

  students!: User[];

  classes!: Class[];

  selectedClasses!: Class[];

  selectedMajors!: Major[];

  submitted!: boolean;

  ref!: DynamicDialogRef;

  constructor(
    private _route: ActivatedRoute,
    private _blockService: BlockService,
    private _userService: UserService,
    private _classService: ClassService,
    private _dialogService: DialogService,
    private _helperService: HelperService,
    private _majorService: MajorService,
    private _mathDesignService: MathdesignService,
    private _confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.fetchAllData();
  }

  fetchAllData(): void {
    this._route.params
    .pipe(
      take(1),
      concatMap(params => this._blockService.findById(params.id)),
      mergeMap((block: Block) => this._helperService.queryMajorsFromBlock(block)),
      mergeMap((block: Block) => this._helperService.queryClassesFromBlock(block)),
    )
    .subscribe((b: Block) => this.bindData(b));
  }

  bindData(b: Block): void {
      this.block = b;
      this.majors = b.majors as Major[];
      this.classes = b.classes as Class[];
  }

  private _showMathDesignDialog(mathdesigns: MathDesign[]): void {
    this.ref = this._dialogService.open(TableMathdesignComponent, {
      data: {
        mathdesigns
    },
        header: 'Danh sách Dạng Toán',
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex: 10000
  });


    // this.ref.onClose.subscribe((product: Product) =>{
    //     if (product) {
    //         this.messageService.add({severity:'info', summary: 'Product Selected', detail: product.name});
    //     }
    // });
  }

  private _showStudentDialog(students: User[]): void {
    this.ref = this._dialogService.open(TableStudentComponent, {
      data: {
        students
    },
        header: 'Danh sách Học Viên',
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex: 10000
  });


    // this.ref.onClose.subscribe((product: Product) =>{
    //     if (product) {
    //         this.messageService.add({severity:'info', summary: 'Product Selected', detail: product.name});
    //     }
    // });
  }

  onShowStudent(c: Class): void {
    this._fetchDataBeforeOpenStudentDialog(c)
      .subscribe((students: User[]) => this._showStudentDialog(students));

  }

  onShowMathDesign(m: Major): void {
    this._fetchDataBeforeOpenMathDesignDialog(m)
      .subscribe((m: MathDesign[]) => this._showMathDesignDialog(m));

  }

  private _fetchDataBeforeOpenMathDesignDialog(m: Major): Observable<User[]> {
    return this._majorService.findById(m.id as string)
    .pipe(
      switchMap((cl: Major) => forkJoin((cl.mathDesigns as string[]).map(mdId => this._mathDesignService.findById(mdId))))
    );
  }

  private _fetchDataBeforeOpenStudentDialog(c: Class): Observable<User[]> {
    return this._classService.findById(c.id as string)
    .pipe(
      switchMap((cl: Class) => forkJoin((cl.users as string[]).map(userId => this._userService.findById(userId))))
    );
  }

  onSelectedMajors(majors: Major[]): void{
    this.selectedMajors = majors;
  }

  onDeleteMajors(): void {
    console.log(123);
    this._confirmationService.confirm({
      message: 'Bạn có chắc chắn xóa các Môn này ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDeleteMajors()
    });
  }

  handlerDeleteMajors(): void {
    if (this.selectedMajors && this.selectedMajors.length > 0){
      const majorIds = [...this.selectedMajors].map(m => m.id) as Array<string>;
      const blockId = this.block.id as string;
      this._blockService.deleteMajors(blockId, majorIds)
         .subscribe(_ => this.fetchAllData());
     }
  }

  onSelectedClass(classes: Class[]): void {
    this.selectedClasses = classes;
  }

  onDeleteClasses(): void {
    this._confirmationService.confirm({
      message: 'Bạn có chắc chắn xóa các Lớp này ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.handlerDeleteClasses()
    });
  }

  handlerDeleteClasses(): void {
    if (this.selectedClasses && this.selectedClasses.length > 0){
      const majorIds = [...this.selectedClasses].map(m => m.id) as Array<string>;
      const blockId = this.block.id as string;
      this._blockService.deleteClasses(blockId, majorIds)
         .subscribe(_ => this.fetchAllData());
     }
  }

  ngOnDestroy(): void {
      if (this.ref) {
          this.ref.close();
      }
  }

}
