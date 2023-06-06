import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {
  pdfSrc: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) { }

  ngOnInit() { }

  createPdf() {
    const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/mantis-project-7c277.appspot.com/o/Screenshot_20230327-202809_Gallery.jpg?alt=media&token=c5ebba52-f2d1-4719-a6f8-b39799b9b677';

    // Download the image using HttpClient
    this.http.get(imageUrl, { responseType: 'blob' }).subscribe((imageBlob: Blob) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;

        const pdfDefinition: any = {
          content: [
            { text: 'Hola mundo' },
            {
              image: imageDataUrl,
              width: 200
            }
          ]
        };

        const pdfDocGenerator = pdfMake.createPdf(pdfDefinition);

        pdfDocGenerator.getBase64((data) => {
          const base64 = `data:application/pdf;base64,${data}`;
          this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(base64);
        });
      };

      reader.readAsDataURL(imageBlob);
    });
  }
}
