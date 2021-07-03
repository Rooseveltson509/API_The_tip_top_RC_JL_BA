import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { Ticket } from "../models/Ticket";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Input() user$ : Observable<User> ;
  Ticket;

  constructor(
    private httpClient : HttpClient
  ) { }

  ngOnInit(): void {
    var url = "http://localhost:3000/api/v1/user/me";
    this.user$ = this.httpClient.get<User>(url);
  }

  onSubmit (ngForm : NgForm){

  }

}
