// cats.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;

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
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create and return the created cat', async () => {
      const createCatDto: CreateCatDto = { name: 'Pixel', age: 2, breed: 'Bombay' };
      expect(await controller.create(createCatDto)).toEqual({ id: 1, ...createCatDto });
      expect(service.create).toHaveBeenCalledWith(createCatDto);
    });
  });

  describe('findAll()', () => {
    it('should return an array of cats', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([{ name: 'Pixel', age: 2, breed: 'Bombay' }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should return a single cat by id', async () => {
      const catId = 1;
      const expectedCat = { id: catId, name: 'Pixel', age: 2, breed: 'Bombay' };
      expect(await controller.findOne(catId)).toEqual(expectedCat);
      expect(service.findOne).toHaveBeenCalledWith(catId);
    });
  });

  describe('remove()', () => {
    it('should remove the cat', async () => {
      const catId = 1;
      await controller.remove(catId);
      expect(service.remove).toHaveBeenCalledWith(catId);
    });
  });
});
