import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import {map, shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  courses = [];
  objectKey = '';
  recentKey = '';

  coursesRef: AngularFireList<any>;
  uploadRef: AngularFireList<any>;
  courseUploadRel: firebase.database.Reference;
  objectdataRef: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase) {
    this.coursesRef = this.db.list('courses');
    this.uploadRef = this.db.list('uploading');
    this.courseUploadRel = this.db.database.ref('course_uploading');

    this.getAllData();
  }

  getAllData() {
    // this.courses = [];

    const coursesRef = this.coursesRef.snapshotChanges().pipe(
      map(data => this.mappingList(data)));

    // get all data
    coursesRef.subscribe((value) => {
      this.courses = value;

      console.warn('list length', value.length);

      value.forEach((v, k) => {
        console.log(k, v.key);
        // get ids from association
        const obj = this.db.list('course_uploading/' + v.key).snapshotChanges();
        obj.subscribe(listKeys => {
          console.log(v.key, listKeys.length, listKeys);
          listKeys.forEach((v2, k2) => {
            console.log('image key', v2.key);
            this.courses[k].imgs = [];
            // get image path
            const obj2 = this.db.object('uploading/' + v2.key).snapshotChanges();

            obj2.subscribe(val => {
              console.warn('image object', val.key);
              const imagePAth: any = val.payload.val();
              this.courses[k].imgs.push(imagePAth.path);
              this.courses[k].imgs = [...new Set(this.courses[k].imgs)];


              // console.log('image object', obj.payload.val().path);
            });
          });
        });

      });

      console.log(this.courses);

      if (value.length) {
        this.recentKey = value[value.length - 1].key;
        this.objectKey = 'courses/' + this.recentKey;
        // this.objectListener();
      }
    });
  }

  objectListener() {
    this.objectdataRef = this.db.object(this.objectKey);

    this.objectdataRef.snapshotChanges().pipe(
      map(a => this.mappingObject(a))
    ).subscribe(value => null/*console.log('object reslt', value)*/);
  }

  mappingList = dataList => dataList.map(a => ({key: a.key, ...a.payload.val()}));

  mappingObject = data => ({key: data.key, ...data.payload.val()});

  ListPush() {
    this.coursesRef.push({description: 'Daniel first push', path: ''})
      .then((res) => {
          console.log('result', res);
          this.recentKey = res.key;
        }
        , (e) => console.error(e));
  }

  ListRemove() {
    if (this.recentKey) {
      this.coursesRef.remove(this.recentKey)
        .then(msg => console.log(msg), (e) => console.error(e));
    }
  }

  ListUpdate() {
    this.coursesRef.update(this.recentKey, {description: 'new description updated'});
  }

  ObjUpdate() {
    this.objectdataRef.update({description: 'object updated'});
  }

  ObjSet() {
    this.objectdataRef.set({description: 'object updated'}); // override
  }


  ObjRemove() {
    this.objectdataRef.remove();
  }
}
