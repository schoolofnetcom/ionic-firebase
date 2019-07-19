import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  formCreateLead: FormGroup;
  leads;

  constructor(
    private fb: FormBuilder,
    public alertController: AlertController,
    private firestore: AngularFirestore,
    ) {}

  ngOnInit() {
    this.formCreateLead = this.fb.group({
      nome: [''],
      email: [''],
    });

    this.firestore.collection('leads')
      .snapshotChanges()
      .subscribe(res => this.leads = res);
  }

  async createLead(e) {
    const data = this.formCreateLead.controls;

    await this.firestore
      .collection('leads')
      .add({
        nome: data.nome.value,
        email: data.email.value,
      })
      .then(res => console.log(res));

    const alert = await this.alertController.create({
      header: 'Cadastrado com sucesso',
      message: `${data.nome.value} - ${data.email.value}`,
    });

    await alert.present();
  }

  remove(lead) {
    this.firestore
      .collection('leads')
      .doc(lead.payload.doc.id)
      .delete();
  }

  completed(lead) {
    this.firestore
      .collection('leads')
      .doc(lead.payload.doc.id)
      .set({
        completed: true,
        email: 'm@e.com',
      }, { merge: true });
  }
}
