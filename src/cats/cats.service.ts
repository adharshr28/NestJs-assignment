
// cats.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interfaces/cat.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,
  ) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const newCat = this.catRepository.create(createCatDto);
    return this.catRepository.save(newCat);
  }

  async findAll(): Promise<Cat[]> {
    return this.catRepository.find();
  }

  async findOne(id: number): Promise<Cat | null> {
    return this.catRepository.findOneBy({ id: id });
  }

  async remove(id: number): Promise<void> {
    await this.catRepository.delete(id);
  }
}
