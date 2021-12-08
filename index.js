const Changeset = require('../etherpad-lite/src/static/js/Changeset');
const padMessageHandler = require('../etherpad-lite/src/node/handler/PadMessageHandler.js');
const fs = require('fs')
const cp = require('child_process');

var update_registry = {}

exports.padUpdate = function (hookName, context, cb) {
    console.log(context);

    var pad = context.pad;
    if (update_registry[pad.id])
    {
	clearTimeout(update_registry[pad.id]);
    }
    update_registry[pad.id] = setTimeout(() => {
    var text = pad.atext.text;
    console.log(text);

    var rgx = /^(.+?)(={5,}[^\n]+?={5,})(.+)?$/s;
    var matches = rgx.exec(text);
    if (matches === null)
    {
	console.log('did not find compiler line');
	return 1;
    }
    var sourcecode = matches[1];
    var compiler_line = matches[2];
    var old_res = matches[3];
    if (old_res.charAt(0) === '\n')
    {
	old_res = old_res.substr(1);
    }

    var update_result = function(res) {
	console.log('old_res: ' + old_res);
	console.log('res: ' + res);
	if (old_res == res)
	{
	    return 2;
	}
	res = '\n' + res;

	var startIdx = sourcecode.length + compiler_line.length;
	console.log('text  ' + text.length.toString());
	console.log('start ' + startIdx.toString());
	console.log('remov ' + (text.length - startIdx).toString());
	console.log('add   ' + res.length.toString());
	if (0)
	{
	var changeset = Changeset.makeSplice(/*oldFullText=*/text,
	    /*spliceStart=*/startIdx,
	    /*numRemoved=*/text.length - startIdx,
	    /*newText=*/res);
	pad.appendRevision(changeset, context.author);
	}
	else
	{
	    console.log('setText()');
	    var xx = 0;
	    var newText = (sourcecode + compiler_line + res).substr(xx);
	    console.log('newText ' + newText);
	    pad.spliceText(xx, text.length-xx, newText);
	    //pad.spliceText(startIdx, text.length-startIdx, res);
	    //pad.setText(sourcecode + compiler_line + res);
	    //var changeset = Changeset.makeSplice(text, 0, text.length, sourcecode + compiler_line + res);
	    //pad.appendChangeset(changeset/*, context.author*/);
	}
	padMessageHandler.updatePadClients(pad);
	return 3;
    };

    var rgx_cmd = /^={5,}(.+?)={5,}/;
    var matches_cmd = rgx_cmd.exec(compiler_line);
    if (matches_cmd === null)
    {
	console.log('could not parse compiler line');
	return update_result('could not parse compiler line');
    }
    var cmd = matches_cmd[1];

    var rgx_extension = /@(\.\w+)@/;
    var matches_extension = rgx_extension.exec(cmd);
    if (matches_extension === null)
    {
	console.log('could not parse file extension');
	return update_result('could not parse file extension.\nIt should have a format like "@.xxx@"');
    }

    // TODO mktemp
    var filename = '/tmp/ep_codingdojo' + matches_extension[1];
    try {
	fs.writeFileSync(filename, sourcecode);
    } catch (err) {
	err = 'could not write file ' + filename + '\n' + err;
	console.log(err);
	return update_result(err);
    }

    cmd = '(cd /tmp ; ' + cmd.replace(rgx_extension, filename) + ') 2>&1 || true';
    //console.log('exec: ' + cmd);
    // run command, capture STDOUT and STDERR, convert \r\n -> \n
    return update_result(cp.execSync(cmd, {"timeout":60*1000}).toString().replace(/\r\n/g, '\n'));
    },
					 3*1000);

    return true;
}
