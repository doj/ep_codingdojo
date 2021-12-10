const Changeset = require('../etherpad-lite/src/static/js/Changeset');
const padMessageHandler = require('../etherpad-lite/src/node/handler/PadMessageHandler.js');
const fs = require('fs')
const cp = require('child_process');
const os = require('os');
const path = require('path')
/// operating system temporary directory.
const tmpDir = os.tmpdir();

var update_registry = {}

exports.padUpdate = function (hookName, context, cb) {
  //console.log(context);

  var pad = context.pad;

  // clear previous timer for this pad.
  if (update_registry[pad.id])
  {
    clearTimeout(update_registry[pad.id]);
  }

  // add a new timer for this pad with a timeout of
  // 3 seconds.
  update_registry[pad.id] = setTimeout(() => {
    var text = pad.atext.text;
    //console.log(text);

    // find the compiler line on the pad text
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

    // function to update the result, which is the text after the compiler line.
    var update_result = function(new_res) {
      var old_res_trimmed = old_res.trim();
      var new_res_trimmed = new_res.trim();
      //console.log('old_res: ' + old_res_trimmed);
      //console.log('new_res: ' + new_res_trimmed);
      if (old_res_trimmed === new_res_trimmed)
      {
	return 2;
      }

      // if the compiler line doesn't end in NL,
      // prefix a NL character to new_res.
      if (compiler_line.charAt(compiler_line.length - 1) !== '\n')
      {
	new_res = '\n' + new_res;
      }

      var startIdx = sourcecode.length + compiler_line.length;
      var removeLen = text.length - startIdx - 1;
      //console.log('text  ' + text.length.toString());
      //console.log('start ' + startIdx.toString());
      //console.log('remov ' + removeLen.toString());
      //console.log('add   ' + new_res.length.toString());

      pad.spliceText(startIdx, removeLen, new_res);
      padMessageHandler.updatePadClients(pad);
      return 3;
    };

    // parse the compiler line to get the compiler command.
    var rgx_cmd = /^={5,}(.+?)={5,}/;
    var matches_cmd = rgx_cmd.exec(compiler_line);
    if (matches_cmd === null)
    {
      return update_result('could not parse compiler line');
    }
    var cmd = matches_cmd[1];

    // parse the file name extension
    var rgx_filename = /@([\.\w_-]+)@/;
    var matches_extension = rgx_filename.exec(cmd);
    if (matches_extension === null)
    {
      return update_result('could not parse file name.\nIt should have a format like "@a.xxx@"');
    }
    var filename = matches_extension[1];

    // create temporary directory
    var fs_sep = path.sep;
    fs.mkdtemp(`${tmpDir}${fs_sep}ep_codingdojo-`, (err,dirname) => {
      if (err)
      {
	update_result('mkdtemp error: ' + err);
	return;
      }

      //console.log('using temporary directory ' + dirname);

      // write the pad source code to a temporary filename
      var abs_filename = dirname + fs_sep + filename;
      try {
	fs.writeFileSync(abs_filename, sourcecode);
      } catch (err) {
	err = 'could not write file ' + abs_filename + '\n' + err;
	update_result(err);
	return;
      }

      // compile
      cmd = '(cd ' + dirname
	+ ' ; ' + cmd.replace(rgx_filename, filename)
	+ ' ; cd ' + tmpDir
	+ ' ; rm -rf ' + dirname
	+ ') 2>&1 || true';
      //console.log('exec: ' + cmd);
      // run command, capture STDOUT and STDERR, convert \r\n -> \n
      update_result(cp.execSync(cmd, {"timeout":60*1000}).toString().replace(/\r\n/g, '\n'));
    });
  },
  3*1000);

  return true;
}
