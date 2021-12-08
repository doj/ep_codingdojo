exports.padUpdate = function (hookName, context, cb) {
    console.log("doj padUpdate");
    console.log(context);

    /*
import {
  open,
} from 'node:fs/promises';

filename = '/tmp/ep_codingdojo';
const fd = await open(filename, 'w');
await fd.write('data');
await fd.close();
    */

    /*
command = 'cd /tmp ; g++ -Wall -std=c++17 ' + filename + ' && ./a.out';
buf = child_process.execSync(command, {"timeout":60});
console.log(buf);
*/
}
