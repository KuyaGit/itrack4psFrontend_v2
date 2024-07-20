import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
// Just Comment

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
