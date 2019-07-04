import Association from "../models/association";

export class AssociationHelper {
  public static async addAssociation(
    associationName: string,
    email: string,
    cellphone: string,
    countryID: string,
    countryName: string,
  ): Promise<any> {
   
    const associationModel = new Association().getModelForClass(Association);
    const assocModel = new associationModel({
      associationName,
      cellphone,
      countryID,
      countryName,
      email,
    });
    const m = await assocModel.save();
    m.associationId = m.id;
    await m.save();
    console.log(
      `\n\n💙💚💛   AssocHelper: Yebo Gogo!!!! - MongoDB has saved ${associationName} !!!!!  💙💚💛`,
    );

    console.log(m);
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
