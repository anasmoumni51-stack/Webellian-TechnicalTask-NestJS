import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CatalogEntity } from './entity/catalog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CatalogsService {

    constructor(@InjectRepository(CatalogEntity) 
    private readonly catalogRepo: Repository<CatalogEntity>) {}


}
