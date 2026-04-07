import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogEntity } from 'src/database/entities/catalog.entity';
import { ProductEntity } from '../database/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CatalogEntity])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
