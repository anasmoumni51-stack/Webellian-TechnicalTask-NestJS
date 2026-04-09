import { Injectable } from "@nestjs/common";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { ProductEntity } from "./entities/product.entity";
import { CatalogEntity } from "./entities/catalog.entity";

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: this.configService.get("DATABASE_HOST", "localhost"),
      port: this.configService.get("DATABASE_PORT", 5432),
      username: this.configService.get("DATABASE_USER", "postgres"),
      password: this.configService.get("DATABASE_PASSWORD", "postgres"),
      database: this.configService.get("DATABASE_NAME", "technicaltask_db"),
      entities: [ProductEntity, CatalogEntity],
      synchronize: this.configService.get("DATABASE_SYNC", true),
    };
  }
}
