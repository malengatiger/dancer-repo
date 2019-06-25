
class Util {
    public static sum(num1: number, num2: number) {
        console.log(`\n\n☘️   Util: sum: 🍔 🍔   summing ${num1} 🍔 🍔   ${num2}`);
        return num1 + num2;
    }

    public static sendError(res, err, message: string) {
        console.error(err);
        res.status(400).json({
          error: err.stack,
          message,
        });
    }
}
export default Util;
