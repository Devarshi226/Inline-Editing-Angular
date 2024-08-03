import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { StudentService } from './student.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] 
})
export class AppComponent implements OnInit {
  title = 'Edit-Table-Row';

  displayedColumns: string[] = ['id', 'name','email','department', 'subject1', 'subject2', 'subject3', 'enroll', 'contact', 'age','action' ];
  dataSource : MatTableDataSource<any>;
  stdForm: FormGroup;
  tableData: any;
  editingRow: any = null;
  showSubjects = false;

  constructor(private fb:FormBuilder, private service:StudentService){
    this.dataSource = new MatTableDataSource<any>(this.tableData);
    this.stdForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', [Validators.required]],
      enroll: ['',[ Validators.required]],
      contact: ['', [Validators.required]],
      subject1: [''],
      subject2: [''],
      subject3: [''],
      age: ['', [Validators.required]]
    })
  }
  ngOnInit(): void {
    this.fetchData();
    this.dataSource.filterPredicate = this.createFilter();

  }

  // createFilter(): (data: any, filter: string) => boolean {
  //   return (data: any, filter: string): boolean => {
  //     const totalMarks = +data.subject1 + +data.subject2 + +data.subject3;
  //     const filterValue = +filter;

  //     return totalMarks == filterValue;
  //   };
  // }

  // applyFilter(filterValue: string): void {
  //   const parsedValue = parseInt(filterValue, 10);
  //   if (!isNaN(parsedValue)) {
  //     this.dataSource.filter = filterValue.trim();
  //   } else {
  //     this.dataSource.filter = '';
  //   }
  // }

  createFilter(): (data: any, filter: string) => boolean {
    return (data: any, filter: string): boolean => {
      const age = +data.age;
      const filterValue = +filter;
      return age == filterValue;
    };
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    const parsedValue = parseInt(filterValue, 10);
  
    if (!isNaN(parsedValue)) {
      this.dataSource.filter = filterValue.trim();
    } else {
      this.dataSource.filter = '';
    }
  }

 


  onDepartmentChange(department: string): void {
    this.showSubjects = !!department;
  }

  fetchData() {
    this.service.getUser().subscribe((data: any) => {
      this.tableData = data;
      this.dataSource.data = this.tableData;
    });
  }
  onSave(){
    if (this.stdForm.valid) {
      this.service.addUser(this.stdForm.value).subscribe(() => {
        this.fetchData();  // Refresh table data
        this.stdForm.reset();  // Reset the form
        this.showSubjects = false; 
      });
    }
  }

  onSave2(row: any) {
    if (this.editingRow) {
      // Update existing user
      this.service.updateUser(this.editingRow.id, this.editingRow).subscribe(() => {
        this.fetchData();  // Refresh table data
        this.editingRow = null;
      });
    }
  }

  onEdit(row: any) {
    this.editingRow = { ...row };
    // this.stdForm.patchValue(row);
  }
  isEditing(row: any): boolean {
    return this.editingRow && this.editingRow.id === row.id;
  }
  onCancelEdit() {
    this.editingRow = null;
    
  }
  onDelete(id: any){
    this.service.deleteUser(id).subscribe(() => {
      this.fetchData();  // Refresh table data after deletion
    });
  }

  reset() {
    this.stdForm.reset(); 
    this.showSubjects = false;
  }
}
