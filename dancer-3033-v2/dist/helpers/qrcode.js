"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qrcode_1 = __importDefault(require("qrcode"));
const vehicle_1 = __importDefault(require("../models/vehicle"));
const qrrecord_1 = __importDefault(require("../models/qrrecord"));
const uuid_1 = __importDefault(require("uuid"));
const messaging_1 = require("../helpers/messaging");
class QRCodeUtil {
    static generateQRCode(vehicleID) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`🍏 🍏 🍏 🍏 Start QR code generation: ${vehicleID} 🍏 🍏 🍏 🍏 `);
            const vehicle = yield vehicle_1.default.findOne({ vehicleID: vehicleID });
            if (!vehicle) {
                throw new Error('Unable to find vehicle');
            }
            console.log(vehicle);
            let mjson = vehicle.vehicleType;
            const type = mjson.get('capacity');
            console.log(`check capacity, should be 16: ${type}`);
            let capacity = 16;
            if (type) {
                capacity = type;
            }
            const responses = [];
            for (let i = 0; i < capacity; i++) {
                const metadata = `${vehicle.associationID}@${vehicle.associationName}@${vehicle.vehicleID}@${i + 1}@${vehicle.vehicleReg}@${JSON.stringify(vehicle.vehicleType)}`;
                console.log(metadata);
                const fileName = `qrcode_${new Date().toISOString()}_${vehicle.vehicleReg}_seat${i + 1}.png`;
                qrcode_1.default.toFile(fileName, metadata)
                    .then(result => {
                    console.log(`🍏 🍏 🍏 🍏 QR code generated; file: ${fileName} 🍏 🍏 🍏 🍏 `);
                })
                    .catch((err) => {
                    throw new Error(`QRCode generation failed: ${err}`);
                });
                console.log(`🍏 🍏 🍏 🍏 starting Firebase storage file upload .... `);
                const bucket = messaging_1.appTo.storage().bucket();
                const res = yield QRCodeUtil.uploadFile(bucket, fileName);
                const urlFromStorageService = JSON.stringify(res);
                console.log(`🍏 🍏 🍏 🍏 Firebase storage file uploaded; url: ${urlFromStorageService} .... `);
                const mRecord = new qrrecord_1.default({
                    vehicleReg: vehicle.vehicleReg,
                    vehicleID: vehicle.vehicleID,
                    vehicleType: vehicle.vehicleType,
                    qrRecordID: uuid_1.default(),
                    associationID: vehicle.associationID,
                    associationName: vehicle.associationName,
                    created: new Date().toISOString(),
                    url: urlFromStorageService,
                    seatNumber: i + 1
                });
                console.log(`🍏 🍏 🍏 🍏 mRecord anyone?? .... check url .......`);
                console.log(mRecord);
                console.log(`🍏 🍏 🍏 🍏 mRecord finished; anyone?? .... `);
                const saved = yield mRecord.save();
                console.log(`💙 💙 💙 💙 💙 qr record #${i + 1} saved on database. 🍎 Yup! 🍎 ${saved}`);
                responses.push(saved);
            }
            console.log(`🍎🍎🍎 Total QR codes generated and saved in database: 🍎${responses.length} 🍎`);
            return responses;
        });
    }
    static uploadFile(bucket, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadTo = `qrcodes/${fileName}`;
            console.log(`💙 💙 💙 💙 💙 ${fileName} uploading QR code to Google Cloud Storage bucket: 🍎 ${bucket}.`);
            const options = {
                destination: uploadTo,
                public: true,
                metadata: {
                    cacheControl: "public, max-age=31536000"
                }
            };
            const response = yield bucket.upload(fileName, options);
            const qrURL = response[1];
            const mm = JSON.parse(JSON.stringify(qrURL));
            console.log(`🌈🌈🌈🌈🌈🌈  the result url from upload to Google: 🌈🌈\n ${mm.mediaLink} \n🌈🌈`);
            console.log(`💙 💙 💙 💙 💙 ${fileName} uploaded to Google Cloud Storage bucket id: 🍎 ${bucket.id} `);
            return mm.mediaLink;
        });
    }
}
exports.default = QRCodeUtil;
//# sourceMappingURL=qrcode.js.map