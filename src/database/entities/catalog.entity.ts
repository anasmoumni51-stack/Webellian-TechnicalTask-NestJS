import { ProductEntity } from './product.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('catalogs')
export class CatalogEntity {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the catalog',
  })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    example: 'Gadget Collection',
    description: 'The name of the catalog',
  })
  @Column({unique: true})
  name!: string;

  @ApiProperty({
    example: 'A collection of gadget products',
    description: 'Description of the catalog',
    required: false,
  })
  @Column({ nullable: true })
  description!: string;

  @ApiProperty({
    example: true,
    description: 'if the catalog is currently active',
  })
  @Column({ default: true })
  isActive!: boolean;

  @ApiProperty({
    type: () => [ProductEntity],
    description: 'Products associated with this catalog',
  })
  @ManyToMany(() => ProductEntity, (product) => product.catalogs, {
    onDelete: 'CASCADE',
  })
  products!: ProductEntity[];
}
