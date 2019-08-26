import {Component, OnInit} from '@angular/core';
import {OperationsService} from '../services/operations.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  storageURL = '';
  message = '';
  authSuccess = false;
  task: AngularFireUploadTask;
  private percentage = 0; // : Observable<number | undefined>
  private snapshot; // : Observable<UploadTaskSnapshot | undefined>
  fileToUpload;

  constructor(public op: OperationsService, public auth: AuthService,
              private fb: FormBuilder, private storage: AngularFireStorage) {
  }

  ngOnInit() {
    this.form = this.fb.group({email: 'omotetedan2@gmail.com', password: 'password'});
  }

  LoginSubmt() {
    this.message = 'Loading...';
    const form = this.form.value;
    this.auth.login(form).then((res) => {
      console.log('resultat', res);
      this.auth.user = res.user;
      this.message = 'Authentification reussie';
      this.authSuccess = true;
    }, (e) => {
      this.authSuccess = false;
      this.message = 'Echec Authentification';
      console.error(e);
    });
  }

  registerSubmt() {
    this.message = 'Loading...';
    const form = this.form.value;
    this.auth.register(form).then((res) => {
      console.log('resultat', res);
      this.auth.user = res.user;
      this.message = 'Enregistrement reussie';
      this.authSuccess = true;
    }, (e) => {
      this.authSuccess = false;
      this.message = 'Echec Enregistrement';
      console.error(e);
    });
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  onFileInput(e) {
    console.log(e);

    const eventObj: MSInputMethodContext = e as MSInputMethodContext;
    const targetFile: HTMLInputElement = eventObj.target as HTMLInputElement;
    this.fileToUpload = targetFile.files;
    console.log('file count', this.fileToUpload.length);
  }

  submit() {
    this.op.coursesRef.push({description: 'Daniel first push', path: ''})
      .then((res) => {
          console.log('result', res);
          const recentKey = res.key;
          this.submitFile(recentKey);
        }
        , (e) => console.error(e));
  }

  submitFile(recentKey) {
    let filename = 'filename';
    for (let i = 0; i < this.fileToUpload.length; i++) {
      console.log(this.fileToUpload[i].type);
      filename = this.fileToUpload[i].name;


      const path = `test/${new Date().getTime()}_${filename}`;
      console.log('filename', path);

      const customMetadata = {app: 'new Upload File!'};
      this.task = this.storage.upload(path, this.fileToUpload[i], {customMetadata});
      this.task.then(() => {
        const ref = this.storage.ref(path);
        ref.getDownloadURL().subscribe(url => {
          this.storageURL = url;
          this.op.coursesRef.update(recentKey, {path: url});
          const newKey = this.op.uploadRef.push({path: url}).key;
          const filePerCourse = this.op.courseUploadRel.child(recentKey);
          filePerCourse.child(newKey).set(true);
        });
      });
      // Progress monitoring

      this.task.percentageChanges().subscribe((value => {
        this.percentage = value;
        console.log('percentage', value);
      }));

      /* this.task.snapshotChanges().subscribe((value => {
         this.snapshot = value;
         console.log('snapshot', value);
       }));*/

    }
  }
}
