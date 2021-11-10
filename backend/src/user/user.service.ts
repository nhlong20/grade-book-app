import { DTO } from "@/type";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) { }

  async updateRole(userId: string, dto: DTO.User.UUpdateRole) {
    const user = await this.userRepo.findOne(userId)
    if (!user) throw new BadRequestException('User does not exist')

    user.role = dto.role
    return await this.userRepo.save(user)
  }

}