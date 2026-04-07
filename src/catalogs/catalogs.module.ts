import { Module } from '@nestjs/common';
import { CatalogsController } from './catalogs.controller';
import { CatalogsService } from './catalogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogEntity } from './entity/catalog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogEntity])],
  controllers: [CatalogsController],
  providers: [CatalogsService],
})
export class CatalogsModule {}
