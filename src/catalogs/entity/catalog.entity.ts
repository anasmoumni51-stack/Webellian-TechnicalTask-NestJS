import { ProductEntity } from 'src/products/entity/product.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('catalogs')
export class CatalogEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: true })
  isActive!: boolean;

  @ManyToMany(() => ProductEntity, (product) => product.catalogs)
  products!: ProductEntity[];
}
