import { Component, OnInit } from '@angular/core';
import { ThemeProperty } from './sideLayer/theme-management/theme-management.component';

interface  Theme {
  themeName: string;
  expanded: boolean;
  values: Array<ThemeProperty>;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'theme-labs-ui';
  public themes : Array<Theme> = [];
  selectedColor: string = '#ff0000'; 
  private savedThemes: Theme[] = [];
  public properties: Array<ThemeProperty> = [];
  public formattedJson: string = '';
  ThemeCssJson: any;
  ngOnInit() {
  }

  newProperty(newProps: ThemeProperty[]) {
    this.properties = newProps;
  
    this.themes.forEach(theme => {
      theme.values = theme.values.filter(p => 
        this.properties.some(np => np.keyName === p.keyName)
      );
  
      this.properties.forEach(newProp => {
        let existingProp = theme.values.find(p => p.keyName === newProp.keyName);
        
        if (!existingProp) {
          theme.values.push(newProp);
          existingProp = newProp;
        }
          this.initializeSingleProperty(existingProp);
      });
  
      this.saveTheme(theme);
    });
  }
  
  

  initializeSingleProperty(prop: ThemeProperty) {
    const type = prop.type.trim();
    
    if (type === "Colors") {
      if (!prop.subType || prop.subType.trim().length === 0) {
        prop.subType = "background-color";
      }
      if (prop.value === null) {
        prop.value = "#000000";
      }
    } else if (type === "Spacing & Sizing") {
      if (!prop.subType || prop.subType.trim().length === 0) {
        prop.subType = "padding";
      }
      prop.numericValue = (prop.numericValue != null) ? prop.numericValue : 0;
      if (!prop.unit || prop.unit.trim().length === 0) {
        prop.unit = "px";
      }
      prop.value = `${prop.numericValue}${prop.unit}`;
    } else if (type === "Box Shadow") {
      Object.assign(prop, { shadowX: 0, shadowY: 0, blur: 5, shadowColor: "#000000" });
      prop.value = `${prop.shadowX}px ${prop.shadowY}px ${prop.blur}px ${prop.shadowColor}`;
    } else if (type === "Borders & Outlines") {
      Object.assign(prop, { borderWidth: 1, borderStyle: "solid", borderColor: "#000000" });
      prop.value = `${prop.borderWidth}px ${prop.borderStyle} ${prop.borderColor}`;
    } else if (type === "Animations") {
      Object.assign(prop, { animationName: "fade-in", animationDuration: 1 });
      prop.value = `${prop.animationName} ${prop.animationDuration}s`;
    }
  }
  
  
  updateProperty(theme: Theme, prop: ThemeProperty) {
    const type = prop.type.trim();
    if (type === "Spacing & Sizing") {
      const numVal = prop.numericValue != null ? prop.numericValue : 0;
      prop.value = `${numVal}${prop.unit || 'px'}`;
    } else if (type === "Box Shadow") {
      prop.value = `${prop.shadowX || 0}px ${prop.shadowY || 0}px ${prop.blur || 5}px ${prop.shadowColor || "#000000"}`;
    } else if (type === "Borders & Outlines") {
      prop.value = `${prop.borderWidth || 1}px ${prop.borderStyle || "solid"} ${prop.borderColor || "#000000"}`;
    } else if (type === "Animations") {
      prop.value = `${prop.animationName || "fade-in"} ${prop.animationDuration || 1}s`;
    } else if (type === "Colors") {
      prop.value = prop.value || "#000000";
    }
    const index = theme.values.findIndex(p => p.keyName === prop.keyName);
    if (index !== -1) {
      theme.values[index] = { ...prop };
    } else {
      theme.values.push({ ...prop });
    }
    this.saveTheme(theme);
  }
  
  saveTheme(theme: Theme) {
    const index = this.savedThemes.findIndex(t => t.themeName === theme.themeName);
    if (index !== -1) {
      this.savedThemes[index] = { ...theme };
    } else {
      this.savedThemes.push({ ...theme });
    }
    this.formattedJson = JSON.stringify(this.themes, null, 2);
    this.convertThemeJsonToCss(this.themes)

  }

  getBoxShadow(prop: ThemeProperty) {
    return `${prop.shadowX}px ${prop.shadowY}px ${prop.blur}px ${prop.shadowColor}`;
  }

  toggleAccordion(theme: Theme, index: number) {
    this.themes.forEach((t, i) => {
      if (i !== index) {
        t.expanded = false;
      }
    });
    if (theme.themeName && theme.themeName.trim().length > 0) {
      theme.expanded = true;
    } else {
      theme.expanded = false;
    }
  }
  
  validateTheme(theme: Theme) {
    if (!theme.themeName || theme.themeName.trim().length === 0) {
      theme.expanded = false;
    }
  }

  public addTheme() {
    const newTheme: Theme = {
      themeName: '',
      expanded: false,
      values: this.properties.map(p => JSON.parse(JSON.stringify(p)))
    };
    this.themes.push(newTheme);
  }
  
  removeTheme(index: number) {
    this.themes.splice(index, 1);
    this.savedThemes.splice(index, 1);
    this.formattedJson = JSON.stringify(this.themes, null, 2);
    this.convertThemeJsonToCss(this.themes)
  }

  mapThemeToExpectedModel(theme: Theme): any {
    let propertiesObj: { [key: string]: string } = {};
    theme.values.forEach(prop => {
      propertiesObj[prop.keyName] = prop.value;
    });
    return { themeName: theme.themeName, properties: propertiesObj };
  }

  getFinalModel(): any[] {
    let x =  this.themes.map(theme => this.mapThemeToExpectedModel(theme));
    return x
  }

  convertThemeJsonToCss(themeJson:any) {
    let x =  themeJson.map((theme:any) => {
      const themeName = theme.themeName;
      const cssVariables = theme.values.map((value:any) => {
        return `  --${value.keyName}: ${value.value};`;
      }).join("\n");
  
      return `/* ${themeName} theme */\n[data-theme="${themeName}"] {\n${cssVariables}\n}`;
    }).join("\n\n");
    this.ThemeCssJson = x;
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.formattedJson).then(() => {
      alert("Copied to clipboard!");
    });
  }
  
}