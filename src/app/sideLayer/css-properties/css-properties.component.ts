import { Component } from '@angular/core';

@Component({
  selector: 'app-css-properties',
  templateUrl: './css-properties.component.html',
  styleUrls: ['./css-properties.component.css']
})
export class CssPropertiesComponent {

  cssProperties = [
    { 
      category: 'Colors 🎨', 
      properties: 'color, background-color, border-color' 
    },
    // { 
    //   category: 'Typography 📝', 
    //   properties: 'font-size, font-weight, letter-spacing, line-height' 
    // },
    { 
      category: 'Spacing & Sizing 🔢', 
      properties: 'width, height, padding, margin, border-radius,font-size, font-weight, letter-spacing, line-height'
    },
    { 
      category: 'Box Shadow 📦', 
      properties: 'box-shadow (offsets, blur, color)' 
    },
    { 
      category: 'Borders & Outlines 📏', 
      properties: 'border-width, border-style, outline' 
    },
    { 
      category: 'Animations ⏳', 
      properties: 'transition, animation-duration, animation-name' 
    },
  ];
  

}
