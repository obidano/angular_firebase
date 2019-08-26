import {Component, OnInit} from '@angular/core';

// import {initializeApp, database} from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Daniel App';

  constructor() {
  }

  ngOnInit(): void {
  }


  /*
 basicWay() {

 const observer = this.db.database.ref('coursesRef/-Ln9iUCyWmQ4ZB36QfTK').on('value', (snap) => {
     console.log(snap.key, snap.val());
   });

this.db.list('coursesRef').snapshotChanges()
     .subscribe(actions => {
       // console.log(actions);
       actions.forEach(action => {
         console.log(action.type, action.key);
         console.log(action.payload.val());
       });
     });

 this.db.list('coursesRef').snapshotChanges().subscribe(value => {
     console.log(value);
   });

  const observ: Observable<any[]> = this.db.list('coursesRef').valueChanges();
   observ.subscribe((value) => {
     console.log(value);
   });

   // Your web app's Firebase configuration
   const firebaseConfig = {
     apiKey: 'AIzaSyBnnLCl5vhBxhxdN38OoJ6S-xDAUPl_rN4',
     authDomain: 'fireproject-bbd68.firebaseapp.com',
     databaseURL: 'https://fireproject-bbd68.firebaseio.com',
     projectId: 'fireproject-bbd68',
     storageBucket: 'fireproject-bbd68.appspot.com',
     messagingSenderId: '863533554884',
     appId: '1:863533554884:web:f10db51939423287'
   };
   // Initialize Firebase
   initializeApp(firebaseConfig);

   const root = database().ref('messages/2');
   root.on('value', snap => {
     console.log(snap.key, snap.val());
   });
 }
 */


}
