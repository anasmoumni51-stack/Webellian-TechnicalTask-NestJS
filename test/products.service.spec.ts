import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { ProductsService } from "../src/products/products.service";
import { ProductEntity } from "../src/database/entities/product.entity";
import { CatalogEntity } from "../src/database/entities/catalog.entity";

describe("ProductsService", () => {
  let service: ProductsService;

  const mockProductRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCatalogRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: mockProductRepo,
        },
        {
          provide: getRepositoryToken(CatalogEntity),
          useValue: mockCatalogRepo,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return all products with default pagination", async () => {
      const mockResult = [{ id: 1, name: "Phone", price: 999.0 }];
      mockProductRepo.find.mockResolvedValue(mockResult);

      const result = await service.findAll({ page: 1, limit: 20 });
      expect(result).toEqual(mockResult);
      expect(mockProductRepo.find).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        order: { id: "ASC" },
      });
    });

    it("should apply pagination correctly", async () => {
      const mockResult = [{ id: 3, name: "Tablet", price: 499.0 }];
      mockProductRepo.find.mockResolvedValue(mockResult);

      const result = await service.findAll({ page: 2, limit: 2 });
      expect(result).toEqual(mockResult);
      expect(mockProductRepo.find).toHaveBeenCalledWith({
        skip: 2,
        take: 2,
        order: { id: "ASC" },
      });
    });

    it("should filter by catalogId when provided", async () => {
      const mockResult = [{ id: 1, name: "Phone", price: 999.0 }];
      mockProductRepo.find.mockResolvedValue(mockResult);

      const result = await service.findAll({ page: 1, limit: 20, catalogId: 1 });
      expect(result).toEqual(mockResult);
      expect(mockProductRepo.find).toHaveBeenCalledWith({
        where: { catalogs: { id: 1 } },
        skip: 0,
        take: 20,
        order: { id: "ASC" },
      });
    });
  });

  describe("findOne", () => {
    it("should return a single product", async () => {
      const product = { id: 1, name: "Phone", price: 999.0 };
      mockProductRepo.findOne.mockResolvedValue(product);

      const result = await service.findOne(1);
      expect(result).toEqual(product);
      expect(mockProductRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw NotFoundException if product is not found", async () => {
      mockProductRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    it("should successfully create a product", async () => {
      const dto = { name: "Tablet", price: 499.0 };
      const savedProduct = { id: 1, ...dto };

      mockProductRepo.create.mockReturnValue(dto);
      mockProductRepo.save.mockResolvedValue(savedProduct);

      const result = await service.create(dto);
      expect(result).toEqual(savedProduct);
    });

    it("should throw ConflictException if name already exists", async () => {
      const dto = { name: "Phone", price: 999.0 };
      mockProductRepo.findOne.mockResolvedValue({ id: 1, name: "Phone" });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe("update", () => {
    it("should update a product", async () => {
      const existingProduct = { id: 1, name: "Old Phone", price: 999.0 };
      const updateDto = { name: "New Phone" };

      mockProductRepo.findOne
        .mockResolvedValueOnce(existingProduct)
        .mockResolvedValueOnce({ ...existingProduct, ...updateDto });

      mockProductRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updateDto);
      expect(result.name).toEqual("New Phone");
    });

    it("should throw NotFoundException if product to update is not found", async () => {
      mockProductRepo.findOne.mockResolvedValue(null);

      await expect(service.update(99, { name: "Test" })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("delete", () => {
    it("should delete a product", async () => {
      const product = { id: 1, name: "Phone", price: 999.0 };
      mockProductRepo.findOne.mockResolvedValue(product);
      mockProductRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete(1);
      expect(result).toEqual(product);
      expect(mockProductRepo.delete).toHaveBeenCalledWith(1);
    });

    it("should throw NotFoundException if product to delete is not found", async () => {
      mockProductRepo.findOne.mockResolvedValue(null);

      await expect(service.delete(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe("assignToCatalog", () => {
    it("should assign a product to a catalog and save the change", async () => {
      const product = { id: 1, name: "Phone", catalogs: [] };
      const catalog = { id: 2, name: "Electronics" };

      mockProductRepo.findOne.mockResolvedValue(product);
      mockCatalogRepo.findOne.mockResolvedValue(catalog);

      // saving the updated product
      const updatedProduct = { ...product, catalogs: [catalog] };
      mockProductRepo.save.mockResolvedValue(updatedProduct);

      const result = await service.assignToCatalog(1, 2);
      expect(result.catalogs.length).toBe(1);
      expect(mockProductRepo.save).toHaveBeenCalled();
    });

    it("should throw NotFoundException if product is missing", async () => {
      mockProductRepo.findOne.mockResolvedValue(null);
      await expect(service.assignToCatalog(999, 2)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw NotFoundException if catalog is missing", async () => {
      mockProductRepo.findOne.mockResolvedValue({
        id: 1,
        name: "Phone",
        catalogs: [],
      });
      mockCatalogRepo.findOne.mockResolvedValue(null);
      await expect(service.assignToCatalog(1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw ConflictException if already assigned", async () => {
      const catalog = { id: 2, name: "Electronics" };
      const product = { id: 1, name: "Phone", catalogs: [catalog] }; // Already has catalog ID 2

      mockProductRepo.findOne.mockResolvedValue(product);
      mockCatalogRepo.findOne.mockResolvedValue(catalog);

      await expect(service.assignToCatalog(1, 2)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe("deleteFromCatalog", () => {
    it("should remove a product from a catalog and save the change", async () => {
      const catalog = { id: 2, name: "Electronics" };
      const product = { id: 1, name: "Phone", catalogs: [catalog] };

      mockProductRepo.findOne.mockResolvedValue(product);
      mockProductRepo.save.mockResolvedValue({ ...product, catalogs: [] });

      const result = await service.deleteFromCatalog(1, 2);
      expect(result.catalogs.length).toBe(0);
    });

    it("should throw ConflictException if trying to remove an unassigned catalog", async () => {
      const catalog = { id: 2, name: "Electronics" };
      const product = { id: 1, name: "Phone", catalogs: [catalog] };

      mockProductRepo.findOne.mockResolvedValue(product);

      // remove catalog 3 (which isn't assigned)
      await expect(service.deleteFromCatalog(1, 3)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
