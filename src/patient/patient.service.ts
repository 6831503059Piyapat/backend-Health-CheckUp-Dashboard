import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
const patients = [
  { name: 'Alice Henderson', sub: 'Female, 34 yrs', id: '#PT-82731', status: 'Stable', statusColor: 'bg-emerald-100 text-emerald-700', lastVisit: 'Oct 12, 2023', dept: 'Cardiology', avatar: 'https://i.pravatar.cc/150?u=alice' },
  { name: 'James Wilson', sub: 'Male, 62 yrs', id: '#PT-82745', status: 'Critical', statusColor: 'bg-rose-100 text-rose-700', lastVisit: 'Oct 21, 2023', dept: 'Neurology', avatar: 'https://i.pravatar.cc/150?u=james' },
  { name: 'Sarah Miller', sub: 'Female, 28 yrs', id: '#PT-82752', status: 'Active', statusColor: 'bg-blue-100 text-blue-700', lastVisit: 'Oct 20, 2023', dept: 'Pediatrics', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { name: 'Robert Chen', sub: 'Male, 45 yrs', id: '#PT-82760', status: 'Stable', statusColor: 'bg-emerald-100 text-emerald-700', lastVisit: 'Oct 15, 2023', dept: 'Oncology', avatar: 'https://i.pravatar.cc/150?u=robert' },
  { name: 'Emily Davis', sub: 'Female, 51 yrs', id: '#PT-82768', status: 'Active', statusColor: 'bg-blue-100 text-blue-700', lastVisit: 'Oct 22, 2023', dept: 'Cardiology', avatar: 'https://i.pravatar.cc/150?u=emily' },
];
@Injectable()
export class PatientService {
  create(createPatientDto: CreatePatientDto) {
    return 'This action adds a new patient';
  }

  findAll() {
    return patients;
  }

  findOne(id: number) {
    return `This action returns a #${id} patient`;
  }

  update(id: number, updatePatientDto: UpdatePatientDto) {
    return `This action updates a #${id} patient`;
  }

  remove(id: number) {
    return `This action removes a #${id} patient`;
  }
}
