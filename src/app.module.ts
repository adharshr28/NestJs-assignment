import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [CoreModule, CatsModule, AuthModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
