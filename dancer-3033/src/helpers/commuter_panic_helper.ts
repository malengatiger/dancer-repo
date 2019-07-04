import * as Moment from 'moment';
import CommuterPanic from '../models/commuter_panic';
import Position from '../models/position';
import Messaging from '../server/messaging';
export class CommuterPanicHelper {

  public static async onCommuterPanicChanged(event: any) {
    console.log(
      `\n👽 👽 👽 onCommuterPanicChangeEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  CommuterPanic in stream:   🍀  🍎  `,
    );
    const data = event.fullDocument;
    await Messaging.sendPanic(data);
  }

  public static async addCommuterPanic(
    active: boolean,
    type: string,
    userId: string,
    latitude: number,
    longitude: number,
    vehicleId: string,
    vehicleReg: string,
  ): Promise<any> {

    const pos = new Position();
    pos.coordinates = [longitude, latitude];

    const commuterPanicModel = new CommuterPanic().getModelForClass(CommuterPanic);
    const commuterPanic = new commuterPanicModel({
      active,
      type,
      userId,
      latitude,
      longitude,
      vehicleId,
      vehicleReg,
      locations: [pos],
    });
    const m = await commuterPanic.save();
    m.commuterPanicId = m.id;
    await m.save();
    console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterPanic added  for: 🍎  ${m.userId} \n\n`);
    console.log(m);
    return m;
  }
  public static async addCommuterPanicLocation(
    commuterPanicId: string,
    latitude: number,
    longitude: number,
    
  ): Promise<any> {
    const commuterPanicModel = new CommuterPanic().getModelForClass(CommuterPanic);
    const panic = await commuterPanicModel.findByPanicId(commuterPanicId);
    if (panic) {
      if (!panic.locations) {
        panic.locations = [];
      }
      const pos = new Position();
      pos.coordinates = [longitude, latitude];
      panic.locations.push(pos);

    } else {
      throw new Error('Original panic record not found');
    }
    const m = await panic.save();
    console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterPanic location added  for: 🍎  ${m.userId} \n\n`);
    console.log(m);
    return m;
  }
  public static async updateCommuterPanicActive(
    active: boolean,
    commuterPanicId: string,
    
  ): Promise<any> {
    const commuterPanicModel = new CommuterPanic().getModelForClass(CommuterPanic);
    const panic = await commuterPanicModel.findByPanicId(commuterPanicId);
    if (panic) {
      panic.active = active;

    } else {
      throw new Error('Original panic record not found');
    }
    const m = await panic.save();
    m.commuterPanicId = m.id;
    await m.save();
    console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterPanic active updated  for: 🍎  ${m.userId} \n\n`);
    return m;
  }

  public static async findByUserId(userId: string): Promise<any> {
    const CommuterPanicModel = new CommuterPanic().getModelForClass(CommuterPanic);
    const list = await CommuterPanicModel.findByUserId(userId);
    return list;
  }

  public static async findByPanicId(commuterPanicId: string): Promise<any> {
    const CommuterPanicModel = new CommuterPanic().getModelForClass(CommuterPanic);
    const panic = await CommuterPanicModel.findByPanicId(commuterPanicId);
    return panic;
  }

  public static async findAllPanicsWithinMinutes(minutes: number): Promise<any> {
    const CommuterPanicModel = new CommuterPanic().getModelForClass(CommuterPanic);
    const list = await CommuterPanicModel.findAllPanicsWithinMinutes(minutes);
    return list;
  }

  public static async findAllPanics(): Promise<any> {
    const CommuterPanicModel = new CommuterPanic().getModelForClass(CommuterPanic);
    const list = await CommuterPanicModel.findAllPanics();
    return list;
  }

}
