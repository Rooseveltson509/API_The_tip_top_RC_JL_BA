import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { environment } from '../../environments/environment';


export interface Stat {
  gain: string;
  count: number;
  remaining : number;
}

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})

export class AdminHomeComponent implements OnInit {

  @Input() users$ : Observable<User>;
  stat : any;
  stat3 : any;

  constructor(
    private httpClient : HttpClient
  ) { }

  @Input() stats$ : Observable<Stat> ;

  ngOnInit(): void {

    var urlUsers = environment.apiUrl+"/admin/users";
    this.users$ = this.httpClient.get<User>(urlUsers);

    var url = environment.apiUrl+"/admin/tickets/";
    var url2 = environment.apiUrl+"/admin/tickets/remaining";
    var url3 = environment.apiUrl+"/admin/tickets/gains";
    this.stats$= this.httpClient.get<Stat>(url2);

    this.httpClient
    .get(url)
    .toPromise()
    .then(
      (res ) => {
        this.stat = res;
      },
      (error) => {

      }
    )

    this.httpClient
    .get(url3)
    .toPromise()
    .then(
      (res) => {
        this.stat3 = res;
      },
      (error) => {

      }
    )
  }

  statCount (produit : string){
    var index = 0
    if (produit==='infuseur à thé')
      index = 0;
      else if (produit==='un coffret découverte d’une valeur de 39€')
        index = 1;
        else if (produit==='un coffret découverte d’une valeur de 69€')
          index = 2;
          else if (produit==='une boite de 100g d’un thé détox ou d’infusion')
            index = 3;
            else if (produit==='une boite de 100g d’un thé signature')
              index = 4;
    return this.stat[index].count;
  }

  statWin (produit : string){
    for (let index = 0; index < this.stat3.length; index++) {
      if (produit===this.stat3[index].gain)
        return this.stat3[index].win ;
    }
    return 0;
  }

}
