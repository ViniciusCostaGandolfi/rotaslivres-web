import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  constructor(private titleService: Title, private metaService: Meta) {
    this.titleService.setTitle('Rotas Livres - Inteligência Logística para Impacto Social');
    this.metaService.updateTag({ name: 'description', content: 'Otimize a logística humanitária com tecnologia de pesquisa da UNICAMP. Reduza desperdícios e garanta que o auxilio chegue mais rápido a quem precisa.' });
    
    // Open Graph
    this.metaService.updateTag({ property: 'og:title', content: 'Rotas Livres - Inteligência Logística para Impacto Social' });
    this.metaService.updateTag({ property: 'og:description', content: 'Otimize a logística humanitária com tecnologia de pesquisa da UNICAMP. Reduza desperdícios e garanta que o auxilio chegue mais rápido a quem precisa.' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://rotaslivres.com.br/' });
  }
}
