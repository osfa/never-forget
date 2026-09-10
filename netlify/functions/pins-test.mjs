// /pins-test.xml — five stills held out of the year, all due now, for checking that
// Pinterest reads the feed before the year starts. See ../lib/feed.mjs.
import { response, testFeed } from "../lib/feed.mjs";

export const handler = async () => response(testFeed());
