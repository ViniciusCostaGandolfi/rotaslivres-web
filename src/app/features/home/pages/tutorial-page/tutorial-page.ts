import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-tutorial-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './tutorial-page.html',
  styleUrl: './tutorial-page.css',
})
export class TutorialPage {
  videoUrl: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/vi9KXVGBQR4');
    
    // SEO and Social Media Metadata
    this.titleService.setTitle('Tutorial - Rotas Livres');
    this.metaService.updateTag({ name: 'description', content: 'Aprenda a otimizar suas rotas e maximizar o impacto social com o tutorial completo do Rotas Livres.' });
    
    // Open Graph
    this.metaService.updateTag({ property: 'og:title', content: 'Tutorial - Rotas Livres' });
    this.metaService.updateTag({ property: 'og:description', content: 'Aprenda a otimizar suas rotas e maximizar o impacto social com o tutorial completo do Rotas Livres.' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://rotaslivres.com.br/tutorial' });
  }
}
