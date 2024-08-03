import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private httpClient:HttpClient) { }

  addUser(data:any){
    return this.httpClient.post("http://localhost:3000/Student",data);
  }
  
  getUser(){
    return this.httpClient.get("http://localhost:3000/Student");
  }

  deleteUser(id: any) {
    return this.httpClient.delete(`http://localhost:3000/Student/${id}`);
  }
  updateUser(id: any, user: any) {
    return this.httpClient.put(`http://localhost:3000/Student/${id}`, user);
  }
}
