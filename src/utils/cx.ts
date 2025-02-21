type CXValue = CXDictionary | string | number | boolean | undefined | null;
type CXDictionary = Record<string, unknown>;
/**
 * cx is a tiny and fast utility for conditionally joining class names together.
 * @param args 
 * @returns 
 */
export const cx = (...args: CXValue[]) => {
	let str = "";
	for (let index = 0; index < args.length; index++) {
		const arg = args[index];
		if (arg) {
			if (typeof arg === "object") {
				for (const key in arg) {
					if (arg[key]) {
						if (str) str += " ";
						str += key;
					}
				}
			} else {
				if (str) str += " ";
				str += arg;
			}
		}
	}
	return str;
};
