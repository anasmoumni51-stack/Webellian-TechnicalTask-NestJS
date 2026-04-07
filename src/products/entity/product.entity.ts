import { CatalogEntity } from "src/catalogs/entity/catalog.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("products")
export class ProductEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({type: 'decimal'})
    price!: number;

    @Column({nullable: true})
    description! : string;

    @Column({default: true})
    isAvailable!: boolean;

    @ManyToMany(() => CatalogEntity, catalog => catalog.assignedProducts)
    @JoinTable({name: 'productsInCatalogs'})
    catalogs!: CatalogEntity[]


}