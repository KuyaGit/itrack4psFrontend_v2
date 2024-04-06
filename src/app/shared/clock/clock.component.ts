import { Component } from '@angular/core';
import { ClockService } from './clock.service';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent {
  currentTime!: Date;

  constructor(private clockService: ClockService) { }

  ngOnInit(): void {
    this.clockService.getCurrentTime().subscribe(time => {
      this.currentTime = time;
    });
  }
}
