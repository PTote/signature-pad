import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.css']
})
export class SignaturePadComponent implements OnInit {


  disabledBtnDownload: boolean = true;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  @ViewChild('btnDownloadJPG', { static: true }) btnDownLoadJPG!: ElementRef;
  @ViewChild('btnDownloadPNG', { static: true }) btnDownLoadPNG!: ElementRef;
  @Output() currentValue = new EventEmitter<string>();

  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
  private lastX: number = 0;
  private lastY: number = 0;

  screenWidth!: number;
  screenHeight!: number;

  ngOnInit(): void {
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    // Actualiza las dimensiones de la pantalla cuando se redimensiona la ventana
    this.getScreenSize();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    const {touches} = event
    this.startPointDrawing(touches[0].clientX, touches[0].clientY)
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    const {touches} = event
    this.drawingMoves(touches[0].clientX, touches[0].clientY);
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    // Manejar evento de finalización de toque
  }

  getScreenSize(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    if (this.ctx?.canvas) {
      this.changeSizeCanvas();
    }

  }

  changeSizeCanvas() {

    if (this.screenWidth > 280 && this.screenWidth < 480) {
      this.ctx.canvas.width = 250
      this.ctx.canvas.height = 100
    }

    if (this.screenWidth > 480 && this.screenWidth < 600) {
      this.ctx.canvas.width = 300
      this.ctx.canvas.height = 150
    }

    if (this.screenWidth > 600 && this.screenWidth < 900) {
      this.ctx.canvas.width = 500
      this.ctx.canvas.height = 300
    }

    if (this.screenWidth > 900) {
      this.ctx.canvas.width = 700
      this.ctx.canvas.height = 500
    }

  }

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    if (this.btnDownLoadJPG && this.btnDownLoadPNG) {
      this.btnDownLoadJPG.nativeElement.disabled = true;
      this.btnDownLoadPNG.nativeElement.disabled = true;
    }

    this.changeSizeCanvas();
  }

  // Manejador para el evento "dragover"
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Manejador para el evento "drop"
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;

    if (files && files.length > 0) {
      const file = files[0]; // Supongamos que solo se permite una imagen a la vez
      this.loadImageFromFile(file);
    }
  }

  // Carga la imagen desde el archivo y la muestra en el canvas
  loadImageFromFile(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;

      image.onload = () => {
        this.ctx.drawImage(image, 0, 0); // Dibuja la imagen en el canvas
        this.isCanvasEmpty();
      };
    };

    reader.readAsDataURL(file);

  }


  private startPointDrawing(clientX: number, clientY: number): void{
    this.drawing = true;
    [this.lastX, this.lastY] = [clientX - this.canvas.nativeElement.offsetLeft, clientY - this.canvas.nativeElement.offsetTop];
  }

  private drawingMoves(clientX: number, clientY: number): void{
    if (!this.drawing) return;

    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    [this.lastX, this.lastY] = [clientX - this.canvas.nativeElement.offsetLeft, clientY - this.canvas.nativeElement.offsetTop];
    this.ctx.lineTo(this.lastX, this.lastY);
    this.ctx.stroke();
    this.isCanvasEmpty()
  }

  onMouseDown(event: MouseEvent): void {
    this.startPointDrawing(event.clientX, event.clientY);
  }

  onMouseMove(event: MouseEvent): void {
    this.drawingMoves(event.clientX, event.clientY);
  }

  onMouseUp() {
    this.drawing = false;
  }

  onMouseLeave() {
    this.drawing = false;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  saveSignatureJPG() {
    const signatureImage = this.canvas.nativeElement.toDataURL('image/jpg');
    const a = document.createElement('a');
    a.href = signatureImage;
    a.download = 'test.jpg'
    console.log(a.download);
    a.click();
  }

  saveSignaturePNG() {
    const signatureImage = this.canvas.nativeElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = signatureImage;
    a.download = 'test.png'
    a.click();
  }

  isCanvasEmpty() {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);


    const empty = imageData.data.some(value => value !== 0)

    if (empty) {
      this.btnDownLoadJPG.nativeElement.disabled = false;
      this.btnDownLoadPNG.nativeElement.disabled = false;

    }
  }

  emitBase64IMG(): void {
    return this.canvas.nativeElement.toDataURL('image/png');
  }

}
