
class Util {

    public static sendError(res: any, err: any, message: string) {
        console.log(`\n\n 🍎🍎 ERROR 🍔 ERROR 🍔 ERROR 🍔 ERROR 🍔 ERROR 🍔 ERROR : 🍎🍎 SENDING: ${message}`);
        console.error(err);

        res.status(400).json({
          error: err,
          message,
        });
        return;
    }
}
export default Util;
