import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../app.module";
import { DataSource } from "typeorm";
import { CatalogEntity } from "../entities/catalog.entity";
import { ProductEntity } from "../entities/product.entity";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const logger = new Logger("Seeder");

  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);
  const catalogRepo = dataSource.getRepository(CatalogEntity);
  const productRepo = dataSource.getRepository(ProductEntity);

  logger.log("Clearing existing database");
  await productRepo.query(`TRUNCATE TABLE products CASCADE`);
  await catalogRepo.query(`TRUNCATE TABLE catalogs CASCADE`);

  logger.log("Creating catalogs");
  const electronics = catalogRepo.create({
    name: "Electronics",
    description: "Tech gadgets and devices",
    isActive: true,
  });
  const books = catalogRepo.create({
    name: "Books",
    description: "Action, fiction, and educational books",
    isActive: true,
  });
  const clothing = catalogRepo.create({
    name: "Clothing",
    description: "Apparel and accessories",
    isActive: true,
  });

  await catalogRepo.save([electronics, books, clothing]);

  logger.log("Creating products");
  const p1 = productRepo.create({
    name: "Smartphone Pro Max",
    price: 999.99,
    description: "Latest flagship smartphone",
    isAvailable: true,
    catalogs: [electronics],
  });

  const p2 = productRepo.create({
    name: "Gaming Laptop",
    price: 1499.5,
    description: "High performance gaming laptop",
    isAvailable: true,
    catalogs: [electronics],
  });

  const p3 = productRepo.create({
    name: "Designing Data-Intensive Applications",
    price: 35.0,
    description: "O'Reilly technical book",
    isAvailable: true,
    catalogs: [books],
  });

  const p4 = productRepo.create({
    name: "Cotton T-Shirt",
    price: 15.99,
    description: "Basic 100% cotton t-shirt",
    isAvailable: true,
    catalogs: [clothing],
  });

  await productRepo.save([p1, p2, p3, p4]);

  logger.log("Database seeding complete");
  await app.close();
}

bootstrap().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
