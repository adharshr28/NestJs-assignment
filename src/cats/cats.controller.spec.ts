import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;

  const mockGuard = {
    canActivate: (context: ExecutionContext) => {
      const requiredRoles = new Reflector().get<string[]>('roles', context.getHandler());
      // Simulate role checking logic: if roles include 'admin', allow access.
      if (requiredRoles.includes('admin')) {
        return true;  // Change to false to simulate unauthorized access
      }
      return false;
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        {
          provide: CatsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              { name: 'Pixel', age: 2, breed: 'Bombay' }
            ]),
            create: jest.fn().mockImplementation((dto: CreateCatDto) =>
              Promise.resolve({ id: 1, ...dto }),
            ),
            findOne: jest.fn().mockImplementation((id: number) =>
              Promise.resolve({ id, name: 'Pixel', age: 2, breed: 'Bombay' }),
            ),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: RolesGuard,
          useValue: mockGuard
        }
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  // Add tests specific for role-based access
  describe('create()', () => {
    it('should create and return the created cat for admin', async () => {
      const createCatDto: CreateCatDto = { name: 'Pixel', age: 2, breed: 'Bombay' };
      expect(await controller.create(createCatDto)).toEqual({ id: 1, ...createCatDto });
      expect(service.create).toHaveBeenCalledWith(createCatDto);
    });
  });

  describe('findAll()', () => {
    it('should return an array of cats for user', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([{ name: 'Pixel', age: 2, breed: 'Bombay' }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should return a single cat by id for user', async () => {
      const catId = 1;
      const expectedCat = { id: catId, name: 'Pixel', age: 2, breed: 'Bombay' };
      expect(await controller.findOne(catId)).toEqual(expectedCat);
      expect(service.findOne).toHaveBeenCalledWith(catId);
    });
  });

  describe('remove()', () => {
    it('should remove the cat for admin', async () => {
      const catId = 1;
      await controller.remove(catId);
      expect(service.remove).toHaveBeenCalledWith(catId);
    });
  });
});
