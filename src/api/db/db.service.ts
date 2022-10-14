import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class DbService {
  create(db_data: CreateDbDto) {
    admin
      .firestore()
      .collection('user')
      .add({
        email: 'tester2@test.test',
        password: 'test321',
      })
      .then(() => {
        console.log('Add record successfully');
        return 'added record successfully';
      })
      .catch((e) => {
        console.error(e);
      });
    return 'This action adds a new db';
  }

  findAll() {
    return `This action returns all db`;
  }

  findOne(id: number) {
    return `This action returns a #${id} db`;
  }

  update(id: number, updateDbDto: UpdateDbDto) {
    return `This action updates a #${id} db`;
  }

  remove(id: number) {
    return `This action removes a #${id} db`;
  }
}
