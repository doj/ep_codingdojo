const Changeset = require('../etherpad-lite/src/static/js/Changeset');
//const Changeset = require("./src/static/js/Changeset");
const fs = require('fs')
const cp = require('child_process');

exports.padUpdate = function (hookName, context, cb) {
    //console.log(context);

    var pad = context.pad;

    var text = pad.atext.text;
    console.log(text);

    var rgx = /^(.+?)(={5,}[^\n]+?={5,}\r?\n)(.+)?$/s;
    var matches = rgx.exec(text);
    if (matches === null)
    {
	console.log('did not find compiler line');
	return true;
    }
    var sourcecode = matches[1];
    var compiler_line = matches[2];
    var old_res = matches[3];

    var rgx_cmd = /^={5,}(.+?)={5,}/;
    var matches_cmd = rgx_cmd.exec(compiler_line);
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
    try {
	fs.writeFileSync(filename, sourcecode);
    } catch (err) {
	console.error(err);
	// TODO: report file write error to pad
	return true;
    }

    cmd = '(cd /tmp ; ' + cmd.replace(rgx_extension, filename) + ') 2>&1 || true';
    console.log('exec: ' + cmd);
    var buf = cp.execSync(cmd, {"timeout":60*1000});
    var res = buf.toString();
    console.log(res);

    if (old_res == res)
    {
	console.log('same result as before, not updating pad');
    }
    else
    {
	// if the compiler line does not have a NL character,
	// prepend the new result string with a NL character.
	if (compiler_line.charAt(compiler_line.length - 1) != '\n')
	{
	    res = '\n' + res;
	}
	var changeset = Changeset.makeSplice(/*oldFullText=*/text,
	    /*spliceStart=*/sourcecode.length + compiler_line.length,
	    /*numRemoved=*/old_res ? old_res.length : 0,
	    /*newText=*/res);
	pad.appendRevision(changeset);
    }

    return true;
}
