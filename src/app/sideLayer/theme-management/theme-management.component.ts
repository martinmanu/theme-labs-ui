import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
export interface ThemeProperty {
  keyName: string;
  type: string;
  value: any;
  numericValue?: number;
  shadowX?: number;
  shadowY?: number;
  blur?: number;
  shadowColor?: string;
  subType?: string;
  borderWidth?: number;
  borderStyle?: string;
  borderColor?: string;
  display?: string;
  zIndex?: number;
  animationName?: string;
  animationDuration?: number;
  unit?:string
}
@Component({
  selector: 'app-theme-management',
  templateUrl: './theme-management.component.html',
  styleUrls: ['./theme-management.component.css']
})
export class ThemeManagementComponent {
  themeForm: FormGroup;
  @Output() themeProperties = new EventEmitter<ThemeProperty[]>();
  dataSource = new MatTableDataSource<ThemeProperty>([]);
  displayedColumns: string[] = ['keyName', 'type', 'action'];
  types = ['Colors', 'Spacing & Sizing', 'Box Shadow', 'Borders & Outlines','Animations'];

  constructor(private fb: FormBuilder) {
    this.themeForm = this.fb.group({
      keyName: ['', [Validators.required, this.duplicateKeyValidator.bind(this)]],
      type: ['Colors', Validators.required]
    });
  }

  isTooltipVisible = false;

  showTooltip() {
    this.isTooltipVisible = true;
  }

  hideTooltip() {
    this.isTooltipVisible = false;
  }

  addThemeProperty() {
    if (this.themeForm.valid) {
      const newProperty: ThemeProperty = { ...this.themeForm.value };
      this.dataSource.data = [...this.dataSource.data, newProperty];

      this.themeForm.reset({ type: 'Colors' });

      this.themeForm.get('keyName')?.updateValueAndValidity();
      this.themeProperties.emit(this.dataSource.data);
    }
  }

  removeProperty(index: number) {
    const updatedData = [...this.dataSource.data];
    updatedData.splice(index, 1);
    this.dataSource.data = updatedData;

    this.themeForm.get('keyName')?.updateValueAndValidity();
    this.themeProperties.emit(this.dataSource.data);
  }

  duplicateKeyValidator(control: AbstractControl): ValidationErrors | null {
    const existing = this.dataSource.data.some(item => item.keyName === control.value);
    return existing ? { duplicateKey: true } : null;
  }

  
}
