import { TestingStore, TestingService } from './../../../@core/service/testing.service';
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, map, switchMap, take, tap } from 'rxjs/operators';
import { ObjectListBox } from 'src/app/@admin/modules/rolegroup/rolegroup.component';
import { UserConstraint } from 'src/app/@core/common/user.constraint';
import { MathDesign } from 'src/app/@core/model/base.mathDesign';
import { Block } from 'src/app/@core/model/block.model';
import { Major } from 'src/app/@core/model/major.model';
import { AuthService } from 'src/app/@core/service/auth.service';
import { BlockService } from 'src/app/@core/service/block.service';
import { HelperService } from 'src/app/@core/service/helper.service';
import { MajorService } from 'src/app/@core/service/major.service';
import { MathdesignService } from 'src/app/@core/service/mathdesign.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  items!: MenuItem[];

  itemphone!: MenuItem[];

  blocks!: Block[];

  block!: Block;

  constructor(
    private _blockService: BlockService,
    public authService: AuthService,
    private _router: Router,
    private _mathDesignService: MathdesignService,
  ) { }


  ngOnInit(): void {

    this.fetchBlock();
  }

  private bindingItems(blocks: Array<ObjectListBox<string>>) {
    this.items = [
      {
        label: 'Trang Chủ',
        icon: 'pi pi-desktop',
        routerLink: ['/'],
      },
      {
        label: 'Khối',
        icon: 'pi pi-th-large',
        items: blocks,
      },
      {
        label: 'Kiểm Tra',
        icon: 'pi pi-pencil',
        routerLink: ['/kiem-tra'],
      },
      {
        label: 'Minigame',
        icon: 'pi pi-android',
        routerLink: ['/minigame'],
      },
      {
        label: 'Bài Kiểm Tra',
        icon: 'pi pi-inbox',
        routerLink: ['/my-test'],
      },
      {
        label: 'Giới Thiệu ',
        icon: 'pi pi-users',
        url: 'https://thcstranphuductrong.edu.vn/index.php?language=vi&nv=about',
      },
      {
        label: '02633843165',
        icon: 'pi pi-phone',
      },
      {
        label: 'Đăng Xuất',
        icon: 'pi pi-fw pi-power-off',
        command: () => {
          this.logout(false);
        },
      }
    ];
  }

  fetchBlock() {
    this._blockService
      .findAllNotPaging()
      .pipe(
        tap((blocks: Block[]) => (this.blocks = blocks)),
        switchMap((_) => this._mathDesignService.findAllNotPaging()),
        concatMap((mds: MathDesign[]) => {
          // loop blocks and transform majors
          const blocks = [...this.blocks].map((block) => {
            // loop majors and transform mathDesigns
            const majors = (block.majors as Major[])?.map((major) => {
              // loop mathDesigns and replace mathDesignIds to objects
              const mathDesigns = (major.mathDesigns as string[])?.map((md) =>
                mds.find((m) => m.id === md)
              );

              major.mathDesigns = mathDesigns as MathDesign[];

              return major;
            });

            block.majors = majors as Major[];

            return block;
          });
          return of(blocks);
        })
      )
      .subscribe((data) => {
        this.blocks = data as Block[];
        this.bindingItems(this.transformMajorsToBlocks(this.blocks));
      });
  }

  private transformMajorsToBlocks(
    blocks: Block[]
  ): Array<ObjectListBox<string>> {
    const rolesTransform = [...blocks]
      .map((b) => {
        const renderMd = (major: Major) =>
          (major.mathDesigns as MathDesign[]).map(
            (md) =>
              ({
                label: md?.mathDesignName as string,
                value: md?.id,
                routerLink:  ['kien-thuc',b.url, major?.url, md?.url],
              } as ObjectListBox<string>)
          );

        const itemMajors: Array<ObjectListBox<string>> = (
          b.majors as Major[]
        ).map(
          (m) =>
            ({
              label: m.majorname as string,
              value: m.id,
              items: renderMd(m),
            } as ObjectListBox<string>)
        );

        const item: ObjectListBox<string> = {
          label: b.blockname as string,
          value: b.id as string,
          items: itemMajors,
        };
        return item;
      })
      .sort();

    return rolesTransform;
  }

  logout(event: boolean): void {
      this.authService.removeTokens();
      this._router.navigate([UserConstraint.LOGIN]);
    }

}
