import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

console.log('🚀 Angular app starting...');

bootstrapApplication(AppComponent, appConfig)
  .then(() => console.log('✅ Angular app bootstrapped successfully!'))
  .catch((err) => console.error('❌ Angular app failed to start:', err));
