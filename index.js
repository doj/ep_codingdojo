exports.padUpdate = function (hookName, context, cb) {
    //console.log(context);

    var text = context.pad.atext.text;
    console.log(text);

    var rgx = /^(.+?)(={5,}[^\n]+?={5,})/s;
    var matches = rgx.exec(text);
    if (matches === null)
    {
	console.log('did not find compiler line');
	return true;
    }

    var rgx_cmd = /^={5,}(.+?)={5,}$/;
    var matches_cmd = rgx_cmd.exec(matches[2]);
    if (matches_cmd === null)
    {
	console.log('could not parse compiler line');
	// TODO: report to pad
	return true;
    }
    var cmd = matches_cmd[1];

    var rgx_extension = /@(\.\w+)@/;
    var matches_extension = rgx_extension.exec(cmd);
    if (matches_extension === null)
    {
	console.log('could not parse file extension');
	// TODO: report to pad
	return true;
    }

    // TODO mktemp
    var filename = '/tmp/ep_codingdojo' + matches_extension[1];
    const fs = require('fs')
    try {
	fs.writeFileSync(filename, matches[1]);
    } catch (err) {
	console.error(err);
	// TODO: report file write error to pad
	return true;
    }

    cmd = '(cd /tmp ; ' + cmd.replace(rgx_extension, filename) + ') 2>&1 || true';
    console.log('exec: ' + cmd);
    const cp = require('child_process');
    var buf = cp.execSync(cmd, {"timeout":60*1000});
    console.log(buf.toString());
    // TODO: update pad with buf

    return true;
}
