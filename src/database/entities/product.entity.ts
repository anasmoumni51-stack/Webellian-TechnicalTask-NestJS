import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CatalogEntity } from './catalog.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class ProductEntity {
  @ApiProperty({ example: 1, description: 'The unique identifier of the product' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 'Wireless Headphones', description: 'The name of the product' })
  @Column()
  name!: string;

  @ApiProperty({ example: 99.99, description: 'The price of the product' })
  @Column({ type: 'decimal' })
  price!: number;

  @ApiProperty({ example: 'High quality noise cancelling headphones', description: 'Description of the product', required: false })
  @Column({ nullable: true })
  description!: string;

  @ApiProperty({ example: true, description: 'if the product is currently available' })
  @Column({ default: true })
  isAvailable!: boolean;

  @ApiProperty({ type: () => [CatalogEntity], description: 'Catalogs containing this product' })
  @ManyToMany(() => CatalogEntity, (catalog) => catalog.products, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'productsInCatalogs' })
  catalogs!: CatalogEntity[];
}
