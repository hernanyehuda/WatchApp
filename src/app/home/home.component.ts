import { Component, OnInit } from '@angular/core';
import { HDate } from '@hebcal/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  currentDateTime: Date = new Date();
  hebrewDate: string = '';
  hebrewDay: string = '';
  dayPart: string = '';
  monthDictionary: { [key: string]: string } = {};
  dayPartsDictionary: { [key: number]: string } = {};
  dayDictionary: string[] = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  showHebrewDate = false;

  constructor() {}

  ngOnInit(): void {
    this.initializeData();
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
  
  }

  initializeData() {
    const now = new Date();
    this.currentDateTime = now;
    this.hebrewDate = this.toHebrewDateString(now);
    this.monthDictionary = this.initializeMonths();
    this.dayPartsDictionary = this.initializeDayParts();
    this.hebrewDay = this.toHebrewDay(now);
    this.dayPart = this.getPartOfDay();
  }

  updateDateTime() {
    const now = new Date();
    this.currentDateTime = now;
    this.hebrewDate = this.toHebrewDateString(now);
    this.hebrewDay = this.toHebrewDay(now);
    this.dayPart = this.getPartOfDay();
  }

  initializeDayParts() {
    return {
      5: 'לילה',
      12: 'בוקר',
      14: 'צהריים',
      18: 'אחר הצהריים',
      21: 'ערב',
      23: 'לילה',
    };
  }

  getPartOfDay() {
    const hour = new Date().getHours();
    for (const key in this.dayPartsDictionary) {
      if (hour < +key) {
        return this.dayPartsDictionary[key];
      }
    }
    return 'לילה';
  }

  toHebrewDateString(date: Date): string {
    const hDate = new HDate(date);
    const day = this.convertNumberToHebrew(hDate.getDate()); 
    const month = this.monthDictionary[hDate.getMonthName()]; 
    const year = this.convertYearToHebrew(hDate.getFullYear()); 
    return `${day} ${month} ${year}`; 
  }

  toHebrewDay(date: Date): string {
    const hDate = new HDate(date);
    return "יום " + this.dayDictionary[hDate.getDay()];
  }

  convertNumberToHebrew(num: number): string { 
    const hebrewNumerals = [
      '', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט',
      'י', 'יא', 'יב', 'יג', 'יד', 'טו', 'טז', 'יז', 'יח', 'יט',
      'כ', 'כא', 'כב', 'כג', 'כד', 'כה', 'כו', 'כז', 'כח', 'כט',
      'ל'
    ];
    return hebrewNumerals[num] || num.toString();
  }

  private readonly hebrewNumerals: { [key: number]: string } = {
    1: 'א', 2: 'ב', 3: 'ג', 4: 'ד', 5: 'ה', 6: 'ו', 7: 'ז', 8: 'ח', 9: 'ט',
    10: 'י', 20: 'כ', 30: 'ל', 40: 'מ', 50: 'נ', 60: 'ס', 70: 'ע', 80: 'פ', 90: 'צ',
    100: 'ק', 200: 'ר', 300: 'ש', 400: 'ת'
  };

  convertYearToHebrew(year: number): string {
    if (year < 5000 || year > 6000) {
      throw new Error('Year must be between 5000 and 6000');
    }

    let result = '';

    // Handle hundreds, tens and ones (ignoring thousands)
    let remainder = year % 1000;

    // Handle hundreds
    let hundreds = Math.floor(remainder / 100) * 100;
    while (hundreds > 0) {
      if (hundreds > 400) {
        result += this.hebrewNumerals[400];
        hundreds -= 400;
      } else {
        result += this.hebrewNumerals[hundreds];
        break;
      }
    }

    // Handle tens and ones
    const tensAndOnes = remainder % 100;
    if (tensAndOnes > 0) {
      if (tensAndOnes === 15 || tensAndOnes === 16) {
        result += this.hebrewNumerals[9] + this.hebrewNumerals[tensAndOnes - 9];
      } else {
        const tens = Math.floor(tensAndOnes / 10) * 10;
        const ones = tensAndOnes % 10;
        if (tens > 0) result += this.hebrewNumerals[tens];
        if (ones > 0) result += this.hebrewNumerals[ones];
      }
    }

    // Add quotation mark before the last letter
    if (result.length > 1) {
      return result.slice(0, -1) + '"' + result.slice(-1);
    }

    return result;
  }
  
  
  

  initializeMonths() {
    return {
      Tishrei: 'תשרי',
      Cheshvan: 'חשון',
      Kislev: 'כסלו',
      Tevet: 'טבת',
      Shevat: 'שבט',
      Adar: 'אדר',
      'Adar I': 'אדר א',
      'Adar II': 'אדר ב',
      Nisan: 'ניסן',
      Iyar: 'אייר',
      Sivan: 'סיון',
      Tammuz: 'תמוז',
      Av: 'אב',
      Elul: 'אלול',
    };
  }
}
