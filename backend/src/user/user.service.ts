import { DTO } from "@/type";
import { AuthRequest } from "@/utils/interface";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) { }

  async patch(req: AuthRequest, dto: DTO.User.UserPatching) {
    const user = await this.userRepo.findOne(req.user.sub)
    if (!user) throw new BadRequestException('User does not exist')

    return this.userRepo.save({
      ...user,
      ...dto
    })
  }

  async updateRole(id: string, dto: DTO.User.UserUpdateRole) {
    const user = await this.userRepo.findOne(id)
    if (!user) throw new BadRequestException('User does not exist')

    user.role = dto.role
    return this.userRepo.save(user)
  }

}