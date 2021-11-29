import { Class } from '@/class/class.entity'
import { BaseEntity } from '@/utils/base.entity'
import { Column, Entity, ManyToOne } from 'typeorm'

@Entity()
export class GradeStructure extends BaseEntity {
    @Column({ type: 'varchar' })
    title: string

    @Column({ type: 'varchar' })
    detail: string

    @ManyToOne(() => Class, clazz => clazz.gradeStructure)
    class: Class
}