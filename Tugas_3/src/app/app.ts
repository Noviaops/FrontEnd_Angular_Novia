import {
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  JsonPipe,
  NgClass,
  NgStyle,
  TitleCasePipe,
  registerLocaleData
} from '@angular/common';

import localeId from '@angular/common/locales/id';

import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HighlightDirective } from './highlight.directive';
import { InitialsPipe } from './initials.pipe';

registerLocaleData(localeId);

@Component({
  selector: 'app-root',
  imports: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    FormsModule,
    HighlightDirective,
    InitialsPipe,
    JsonPipe,
    NgClass,
    NgStyle,
    TitleCasePipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // =========================
  // NG CLASS
  // =========================
  readonly isActive = signal(true);
  readonly isHighlighted = signal(false);

  // =========================
  // STANDALONE DIRECTIVE
  // =========================
  readonly highlightColor = signal('#f5c84b');

  // =========================
  // NG STYLE
  // =========================
  styleColor = '#126782';
  styleFontSize = 1.2;
  styleBackground = '#e3f4f1';

  // =========================
  // NG MODEL
  // =========================
  nama = 'Mahasiswa TPL 2024';
  pesan = 'Saya sedang belajar directive dan pipe.';

  // =========================
  // BUILT-IN PIPE
  // =========================
  customer = 'pt novia';
  total = 1250000;
  issuedAt = new Date();

  invoice = {
    nomor: 'INV-001',
    status: 'Lunas'
  };

  // =========================
  // CUSTOM PIPE
  // =========================
  user = {
    name: 'Novia Zhang'
  };

  // =========================
  // NG CLASS
  // =========================
  readonly classCard = () => ({
    active: this.isActive(),
    inactive: !this.isActive(),
    highlight: this.isHighlighted()
  });

  toggleClassState(): void {
    this.isActive.update((active) => !active);
  }

  toggleHighlight(): void {
    this.isHighlighted.update((highlighted) => !highlighted);
  }

  // =========================
  // NG STYLE
  // =========================
  increaseFont(): void {
    this.styleFontSize = Math.min(
      this.styleFontSize + 0.1,
      1.8
    );
  }

  decreaseFont(): void {
    this.styleFontSize = Math.max(
      this.styleFontSize - 0.1,
      0.9
    );
  }

  cycleStyle(): void {
    const palettes = [
      {
        color: '#126782',
        background: '#e3f4f1'
      },
      {
        color: '#8c3d2f',
        background: '#fbe9df'
      },
      {
        color: '#4c458b',
        background: '#eeeafd'
      }
    ];

    const currentIndex = palettes.findIndex(
      (palette) => palette.color === this.styleColor
    );

    const next =
      palettes[(currentIndex + 1) % palettes.length];

    this.styleColor = next.color;
    this.styleBackground = next.background;
  }
}