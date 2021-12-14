import { Module } from '@nestjs/common'
import { CsvModule } from 'nest-csv-parser'

@Module({
  imports: [CsvModule]
})
export class StudentModule {}
