// /pins.xml — a year of stills, 11 September 2026 to 11 September 2027, served as
// they fall due. Pinterest reads this and pins from it on its own. See ../lib/feed.mjs.
import { response, yearFeed } from "../lib/feed.mjs";

export const handler = async () => response(yearFeed());
