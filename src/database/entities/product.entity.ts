import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CatalogEntity } from './catalog.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'decimal' })
  price!: number;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: true })
  isAvailable!: boolean;

  @ManyToMany(() => CatalogEntity, (catalog) => catalog.products, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'productsInCatalogs' })
  catalogs!: CatalogEntity[];
}
