
import { instanceMethod, InstanceType, ModelType, prop, staticMethod, Typegoose } from "typegoose";

class Association extends Typegoose {

    @staticMethod
    public static findByName(this: ModelType<Association> & typeof Association, name: string) {
      console.log("#####  🥦  🥦  🥦 Finding association by name:  💦  💦  💦  :: 🥦 " + name);
      return this.findOne({ name });
    }
    @staticMethod
    public static findByAssociationID(this: ModelType<Association> & typeof Association, associationID: string) {
      console.log("#####  🥦  🥦  🥦 Finding association by ID:  💦  💦  💦  :: 🥦 " + associationID);
      return this.findOne({ associationID });
    }

    @prop({required: true, unique: true, trim: true})
    public associationName?: string;
    @prop()
    public email?: string;
    //
    @prop()
    public cellphone?: string;

    @prop({required: true, trim: true})
    public countryID?: string;
    //
    @prop({required: true, trim: true})
    public associationID?: string;
    //
    @prop({required: true})
    public countryName?: string;
    //
    @prop({required: true, default: new Date().toISOString()})
    public created?: string;

    @instanceMethod
    public updateEmail(this: InstanceType<Association>, email: string) {
      this.email = email;
      this.save();
    }
    @instanceMethod
    public updateCellphone(this: InstanceType<Association>, cellphone: string) {
      this.cellphone = cellphone;
      this.save();
    }
  }

export default Association;
