import { DynamicModule, Module } from '@nestjs/common';
import { EmailModuleOptions } from './interfaces/emails.interface';
import { EmailsService } from './emails.service';

@Module({})
export class EmailsModule {
  static forRoot(options: EmailModuleOptions): DynamicModule {
    return {
      module: EmailsModule,
      exports: [EmailsService],
      providers: [
        {
          provide: 'OPTIONS',
          useValue: options,
        },
        EmailsService,
      ],
    };
  }
}
