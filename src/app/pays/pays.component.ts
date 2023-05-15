import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, debounceTime, fromEvent, map } from 'rxjs';
import { Pays } from './pays.model';

@Component({
  selector: 'app-pays',
  templateUrl: './pays.component.html',
  styleUrls: ['./pays.component.css']
})
export class PaysComponent implements AfterViewInit, OnDestroy{
  sub!: Subscription;
  downsub!: Subscription;

  @ViewChild('input')
  inputText!: ElementRef;

  pays: Array<Pays> = [
    {
      code:'FR',
      libelle: 'France',
    },
    {
      code:'AL',
      libelle: 'Albania',
    },
    {
      code:'DZ',
      libelle: 'Algeria',
    },
    {
      code:'En',
      libelle: 'English',
    },
    {
      code:'AF',
      libelle: 'Afghanistan',
    }
  ]

  paysAct: Array<Pays>=[];
  paysNb: number = 0;

  constructor(){}

  ngAfterViewInit(): void{
    this.sub = fromEvent(this.inputText.nativeElement, 'keyup')
    .pipe(
      debounceTime(500),
      map((x)=>this.inputText.nativeElement.value)
    )
    .subscribe((x)=>{
      if (x.trim().length===0){
        this.paysAct =[];
      } else {
        this.paysAct = this.pays.filter((y)=>
        y.libelle
          .toLowerCase()
          .startsWith(this.inputText.nativeElement.value.toLowerCase())
          );
      }
      this.paysNb = 0;
    });
  }

  onBlur(){
    let meComponent = this;
    setTimeout(function () {
      meComponent.paysAct = [];
    },150)
    this.downsub.unsubscribe()
  }

  onFocus() {
    if (this.inputText.nativeElement.value.trim().length > 0) {
      this.paysAct = this.pays.filter((y)=>
      y.libelle
        .toLowerCase()
        .startsWith(this.inputText.nativeElement.value.toLowerCase())
        );
    }
    this.downsub = fromEvent(this.inputText.nativeElement, 'keydown')
    // Je ne peux pas utiliser x:KeyboardEvent
    .subscribe((x) => {
      if (x instanceof KeyboardEvent){
        if ((x.key == 'ArrowDown')&&(this.paysAct.length != 0)) {
          if (this.paysAct.length <= this.paysNb) {
            this.paysNb = 0;
          }
          this.inputText.nativeElement.value = this.paysAct[this.paysNb].libelle;
          this.paysNb++;
        }
        else if ((x.key == 'ArrowUp')&&(this.paysAct.length != 0)) {
          this.paysNb--;
          if (this.paysNb===-1) {
            this.paysNb = this.paysAct.length-1;
          }
          this.inputText.nativeElement.value = this.paysAct[this.paysNb].libelle;
        }
      }
    });
  }

  selectPays(event : MouseEvent) {
    // Il faut faire un double click pour que ça marche
    if ((event.target != null) && (event.target instanceof HTMLElement))
      {this.inputText.nativeElement.value = event.target.innerText;
      }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
