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

  @ViewChild('input')
  inputText!: ElementRef;

  pays: Array<Pays> = [
    {
      code:'FR',
      libelle: 'France',
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
        this.paysAct = this.paysAct.filter((y)=>
        y.libelle.toLowerCase().startsWith(x.toLowerCase()));
      }
    });
  }

  onBlur(){
    let meComponent = this;
    setTimeout(function () {
      meComponent.paysAct = [];
    },150)
  }

  onFocus() {
    if (this.inputText.nativeElement.value.trim().length > 0) {
      this.paysAct = this.pays.filter((y)=>
      y.libelle
        .toLowerCase()
        .startsWith(this.inputText.nativeElement.value.toLowerCase())
        );
    }
  }

  selectPays(event : MouseEvent) {
    if ((event.target != null) && (event.target instanceof HTMLElement))
      {this.inputText.nativeElement.value = event.target.innerText;
      console.log(event.target.innerText);
      }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
