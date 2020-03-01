import QRCode from 'qrcode'
import Vehicle from '../models/vehicle'
import QRRecord from '../models/qrrecord'
import uuid from 'uuid'
import fs from 'fs'
import { appTo } from '../helpers/messaging'
import { UploadResponse, Bucket } from '@google-cloud/storage';
import {IQRRecord} from '../models/qrrecord'

class QRCodeUtil {

    static async generateQRCode(vehicleID: String): Promise<any> {
        console.log(`🍏 🍏 🍏 🍏 Start QR code generation: ${vehicleID} 🍏 🍏 🍏 🍏 `);

        const vehicle: any = await Vehicle.findOne({ vehicleID: vehicleID })
        if (!vehicle) {
            throw new Error('Unable to find vehicle');
        }
        console.log(vehicle);
        let mjson: Map<String, any> = vehicle.vehicleType
        const type = mjson.get('capacity')
        console.log(`check capacity, should be 16: ${type}`)
        let capacity = 16
        if (type) {
            capacity = type
        } 
        const responses: IQRRecord[] = []
        for (let i = 0; i < capacity; i++) {
            const metadata = `${vehicle.associationID}@${vehicle.associationName}@${vehicle.vehicleID}@${i+1}@${vehicle.vehicleReg}@${JSON.stringify(vehicle.vehicleType)}`
            console.log(metadata);
            const fileName = `qrcode_${new Date().getTime()}_${vehicle.vehicleReg}_seat${i+1}.png`
            await QRCode.toFile(fileName, metadata)
                .then(result => {
                    console.log(`🍏 🍏 🍏 🍏 QR code generated; file: ${fileName} 🍏 🍏 🍏 🍏 `);
                })
                .catch((err) => {
                    throw new Error(`QRCode generation failed: ${err}`)
                });
             
            console.log(`🍏 🍏 🍏 🍏 starting Firebase storage file upload .... `);
            const bucket: any = appTo.storage().bucket();
            const res: String = await QRCodeUtil.uploadFile(bucket, fileName);
            const urlFromStorageService = JSON.stringify(res)
            console.log(`🍏 🍏 🍏 🍏 Firebase storage file uploaded; url: ${urlFromStorageService} .... `);
            const mRecord = new QRRecord({
                vehicleReg: vehicle.vehicleReg,
                vehicleID: vehicle.vehicleID,
                vehicleType: vehicle.vehicleType,
                qrRecordID: uuid(),
                associationID: vehicle.associationID,
                associationName: vehicle.associationName,
                created: new Date().toISOString(),
                url: urlFromStorageService, 
                seatNumber: i + 1
            })
            console.log(`🍏 🍏 🍏 🍏 mRecord anyone?? .... check url .......`);
            console.log(mRecord);
            console.log(`🍏 🍏 🍏 🍏 mRecord finished; anyone?? .... `);
            
            const saved = await mRecord.save()
            console.log(`💙 💙 💙 💙 💙 qr record #${i + 1} saved on database. 🍎 Yup! 🍎 ${saved}`)
            responses.push(saved);
        }
        
        console.log(`🍎🍎🍎 Total QR codes generated and saved in database: 🍎${responses.length} 🍎`);
        
        return responses
    }

    static async uploadFile(bucket: Bucket, fileName: string): Promise<String> {
        const uploadTo = `qrcodes/${fileName}`;

        console.log(`💙 💙 💙 💙 💙 ${fileName} uploading QR code to Google Cloud Storage bucket: 🍎 ${bucket}.`);

        const options: any = {
            destination: uploadTo,
            public: true,
            metadata: {
                cacheControl: "public, max-age=31536000"
            }

        }
        const response: UploadResponse = await bucket.upload(fileName, options);
        const qrURL: any = response[1]
        const mm = JSON.parse(JSON.stringify(qrURL))
        console.log(`🌈🌈🌈🌈🌈🌈  the result url from upload to Google: 🌈🌈\n ${mm.mediaLink} \n🌈🌈`);
        console.log(`💙 💙 💙 💙 💙 ${fileName} uploaded to Google Cloud Storage bucket id: 🍎 ${bucket.id} `);
        
        return mm.mediaLink

    }
}
export default QRCodeUtil