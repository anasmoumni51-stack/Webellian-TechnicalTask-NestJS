import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CatalogsService } from '../src/catalogs/catalogs.service';
import { CatalogEntity } from '../src/database/entities/catalog.entity';
import { NotFoundException } from '@nestjs/common';

describe('CatalogsService', () => {
  let service: CatalogsService;

  const mockCatalogRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogsService,
        {
          provide: getRepositoryToken(CatalogEntity),
          useValue: mockCatalogRepository,
        },
      ],
    }).compile();

    service = module.get<CatalogsService>(CatalogsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of catalogs', async () => {
      const catalogs = [{ id: 1, name: 'Catalog 1' }];
      mockCatalogRepository.find.mockResolvedValue(catalogs);

      const result = await service.findAll();
      expect(result).toEqual(catalogs);
      expect(mockCatalogRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single catalog', async () => {
      const catalog = { id: 1, name: 'Catalog 1' };
      mockCatalogRepository.findOne.mockResolvedValue(catalog);

      const result = await service.findOne(1);
      expect(result).toEqual(catalog);
      expect(mockCatalogRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if catalog is not found', async () => {
      mockCatalogRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should successfully create a catalog', async () => {
      const dto = { name: 'Test Catalog', isActive: true };
      const savedCatalog = { id: 1, ...dto };

      mockCatalogRepository.create.mockReturnValue(dto);
      mockCatalogRepository.save.mockResolvedValue(savedCatalog);

      const result = await service.create(dto);
      expect(result).toEqual(savedCatalog);
    });
  });

  describe('update', () => {
    it('should update a catalog', async () => {
      const existingCatalog = { id: 1, name: 'Old Catalog' };
      const updateDto = { name: 'Updated Catalog' };

      mockCatalogRepository.findOne
        .mockResolvedValueOnce(existingCatalog)
        .mockResolvedValueOnce({ ...existingCatalog, ...updateDto });

      mockCatalogRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updateDto);
      expect(result.name).toEqual('Updated Catalog');
    });
  });

  describe('delete', () => {
    it('should delete a catalog', async () => {
      const catalog = { id: 1, name: 'Catalog 1' };
      mockCatalogRepository.findOne.mockResolvedValue(catalog);
      mockCatalogRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete(1);
      expect(result).toEqual(catalog);
      expect(mockCatalogRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
