import v1 from "uuid/v1";
import Association from "../models/association";

export class AssociationHelper {
  public static async addAssociation(
    associationName: string,
    email: string,
    cellphone: string,
    countryID: string,
    countryName: string,
  ): Promise<any> {
    console.log(
      `\n\n🌀  🌀  🌀  AssocHelper: addAssociation   🍀   ${associationName} -   🍀   ${cellphone}   🍀   ${email}\n`,
    );
    console.log(
      // tslint:disable-next-line: max-line-length
      `\n👽 👽 👽 👽  AssocHelper: attempting MongoDB write using Typegoose  🍎  getModelForClass  .......... 👽 👽 👽\n`,
    );

    const associationID =  v1();
    const associationModel = new Association().getModelForClass(Association);
    const assocModel = new associationModel({
      associationID,
      associationName,
      cellphone,
      countryID,
      countryName,
      email,
    });
    const m = await assocModel.save();
    console.log(
      `\n\n💙  💚  💛   AssocHelper: Yebo Gogo!!!! - MongoDB has saved ${associationName} !!!!!  💙  💚  💛`,
    );

    const ass = await associationModel.findByName(
      "MongoDataX Taxi Association",
    );
    console.log(`\n💛 💛 💛 💛  Association found in Mofo: 💚  ${ass}`);
    console.log(ass);
    console.log(
      `🏓  db: ${m.db.db.databaseName} 💛 💛 collection: ${
        m.collection.collectionName
      } 💙 💙  id: ${m.id}`,
    );

    return m;
  }

  public static async getAssociations(): Promise<any> {
    console.log(` 🌀 getAssociations ....   🌀  🌀  🌀 `);
    const assocModel = new Association().getModelForClass(Association);
    const list = await assocModel.find();
    console.log(list);
    return list;
  }
  public static async onAssociationAdded(event: any) {
    console.log(`onAssociationAdded event has occured .... 👽 👽 👽`);
    console.log(event);
    console.log(
      `operationType: 👽 👽 👽  ${
        event.operationType
      },   🍎 `,
    );

  }
}
