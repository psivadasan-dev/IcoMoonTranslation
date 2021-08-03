import {Component, OnInit, ViewEncapsulation} from '@angular/core';

interface CSSStyleRule {
  selectorText: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {

  public icoMoonSelectors: any[] = [];

  rows: any[] = [];
  columns: any = {};

  constructor() {
    this.rows = [];
    this.columns = [{ name: 'Selector', width: 500 }, { name: 'Icon', width: 100 }];
  }

  ngOnInit() {
    setTimeout(() => {
      const styleSheets: any[] = Object.values(document.styleSheets);
      const cssRules: {} = this.getCSSRulesInStyleSheets(styleSheets);
      if (cssRules) {
        this.icoMoonSelectors = this.getValidSelectors(cssRules);
        this.icoMoonSelectors = this.removeDuplicates();
      }
      this.initializeDataTable();
    });
  }

  private getCSSRulesInStyleSheets(styleSheets: any[]) {
    return styleSheets.reduce((acc, crr) => {
      const rules = crr.cssRules || crr.rules;
      if (rules) {
        return {
          ...acc,
          ...rules
        };
      }
      return acc;
    }, {});
  }

  private getValidSelectors(cssRules: {}) {
    const allSelectors: any[] = [];
    Object.values(cssRules).forEach((styleRule: CSSStyleRule) => {
      if (styleRule && styleRule.selectorText && styleRule.selectorText.includes('.icon-')) {
        const selectors: any[] = styleRule.selectorText
            .split(' ')
            .filter((selector) => selector.includes('.icon-'))
            .map((selector) => selector.split('::')[0]);
        allSelectors.push(...selectors);
      }
    });
    return allSelectors;
  }

  private removeDuplicates() {
    return this.icoMoonSelectors
        .filter((x, y) => this.icoMoonSelectors.indexOf(x) === y);
  }

  private initializeDataTable() {
    this.icoMoonSelectors.forEach((selector) => {
      this.rows.push({
        selector,
        icon: `<i class='${selector.substring(1)}'></i>`
      });
    });
    this.rows = [...this.rows];
  }
}
