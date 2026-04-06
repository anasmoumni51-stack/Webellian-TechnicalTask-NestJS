import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogsModule } from './catalogs/catalogs.module';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CatalogsModule, 
    ProductsModule, 
    ConfigModule.forRoot({ isGlobal:true, envFilePath: '.env',})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
