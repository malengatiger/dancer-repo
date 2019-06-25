import { expect } from "chai";
import * as mocha from "mocha";
import Association from "../models/association";
import Util from "../routes/util";
import { AssociationHelper } from "./../helpers/association_helper";

describe("\n💀 💀 💀 💀 💀  🎈  AR MongoDB API unit tests   🎈  ☘️ 🍀", () => {
  it("\n💚  💙  💜   should return 12 afer summing 5 + 7", () => {
    console.log(
      `\n\n💀  💀   Running fake test. 💀  🎈 🎈 🎈 🎈  just to get going ....`,
    );
    const result = Util.sum(5, 7);

    expect(result).to.equal(12);
  });
  // it("\n💚  💙  💜   result should have created as non null",  (done) => {

  //   const ass = new Association();
  //   ass.cellphone = "099 666 5437";
  //   ass.email = "aubrs@ggmail.com";
  //   ass.name = "Taxi Association " + new Date().getTime();
  //   expect(ass).to.not.equal(null);
  //   AssociationHelper.addAssociation(ass.name, ass.email, ass.cellphone).then((m) => {
  //     console.log(m);
  //     //expect(m.created).to.not.equal(null);
  //     console.log(`we go here after the call`);
  //     done();
  //   }).catch((err) => {
  //     console.error(err);
  //     done();

  //   });
  //   console.log(ass);
  // });
  it("\n💚  💙  💜   assertion success", () => {
    // this.timeout(5000);
    // const resolvingPromise = new Promise(resolve => {
    //   setTimeout(() => resolve("promise resolved"), 3000)
    // });

    const ass = new Association();
    ass.cellphone = "099 666 5437";
    ass.email = "aubrs@ggmail.com";
    ass.associationName = "Taxi Association " + new Date().getTime();
    expect(ass).to.not.equal(null);

    // const result = await AssociationHelper.addAssociation(ass.name, ass.email, ass.cellphone);
    // expect(result).to.equal("promise resolved");
    // done();
  });
});
