//////////////////////////////////////////////////////////////////////////////
// ep_codingdojo configuration

/// number of seconds to wait until a compilation is started
const inputDelay_sec = 3;

/// number of seconds for timeout of a compilation command
const compilationTimeout_sec = 30;

/// number of seconds for timeout to clean up the temporary directory
const cleanupTimeout_sec = 5;

//////////////////////////////////////////////////////////////////////////////

// import some other JavaScript code
const Changeset = require('ep_etherpad-lite/static/js/Changeset');
const padMessageHandler = require('ep_etherpad-lite/node/handler/PadMessageHandler');
const fs = require('fs')
const cp = require('child_process');
const os = require('os');
const path = require('path')

/// operating system temporary directory.
const tmpDir = os.tmpdir();

/// file system path separator character
var fs_sep = path.sep;

/// dictionary of pad timers.
/// key: Pad ID string.
/// val: timer object.
var update_registry = {}

/// callback function for the Etherpad "padUpdate" hook.
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
    // create temporary directory
    fs.mkdtemp(`${tmpDir}${fs_sep}ep_codingdojo-`, (err,dirname) => {
      if (err)
      {
	console.log('mkdtemp error: ' + err);
	return;
      }

      //console.log('using temporary directory ' + dirname);

      var text = pad.atext.text;
      //console.log(text);

      // regular expression to match a compile line
      var rgx_command_line = /^={5,}(.+?)={5,}/;
      // regular expression to match a file name
      var rgx_filename = /@([\.\w_-]+)@/;

      // current character index in the pad text string.
      var idx = 0;
      // character index after the last compile command.
      var startIdx = 0;

      // new result string
      var new_res = '';
      // old result string, or source code string
      var old_res = '';

      // iterate all lines in the pad text
      var lines = text.split(/\r?\n/);
      for(var i = 0; i < lines.length; i++)
      {
	// get current line and update idx
	var line = lines[i];
	idx += line.length + 1;

	// check if it is a compile line
	var matches = rgx_command_line.exec(line);
	if (matches === null)
	{
	  old_res = old_res + line + '\n';
	  continue;
	}

	// save idx of the last compile line
	startIdx = idx;

	// get the filename from the compile line
	var cmd = matches[1];
	matches = rgx_filename.exec(cmd);
	if (matches === null)
	{
	  new_res = new_res + 'could not find filename\n';
	  continue;
	}
	var filename = matches[1];

	// write the pad's section to the file
	var abs_filename = dirname + fs_sep + filename;
	try {
	  fs.writeFileSync(abs_filename, old_res);
	  //console.log('wrote ' + filename);
	} catch (err) {
	  new_res = new_res + 'could not write file ' + abs_filename + '\n' + err + '\n';
	}
	old_res = '';

	// construct the compile command
	cmd = '( ' + cmd.replace(rgx_filename, filename) // the compile command from the Etherpad
	//+ ' ; mv -f * /tmp/' // only enable this line for debugging!
	  + ' ) 2>&1 ' // redirect STDERR to STDOUT
	  + '|| true'; // force a success exit status code, to make Node.js execSync() happy
	//console.log('exec: ' + cmd);
	// execute the command, capture STDOUT, convert \r\n to \n
	try {
	  new_res = new_res + cp.execSync(cmd, {"timeout":compilationTimeout_sec*1000, "cwd":dirname}).toString().replace(/\r\n/g, '\n');
	} catch (err) {
	  new_res = new_res + 'Exception: could not execute: ' + cmd + ' : ' + err + '\n';
	}
      } // for

      // remove temporary directory
      try {
	cp.execSync('rm -rf ' + dirname, {"timeout":cleanupTimeout_sec*1000, "cwd":tmpDir});
      } catch (err) {
	new_res = new_res + 'Exception: could not remove ' + dirname + ' : ' + err + '\n';
      }

      // compare new and old result
      var old_res_trimmed = old_res.trim();
      var new_res_trimmed = new_res.trim();
      //console.log('old_res: ' + old_res_trimmed);
      //console.log('new_res: ' + new_res_trimmed);
      if (old_res_trimmed === new_res_trimmed)
      {
	return 2;
      }

      // if the last compiler line doesn't end in NL,
      // prefix a NL character to new_res.
      if (startIdx == text.length)
      {
	new_res = '\n' + new_res;
      }

      // update the result on the pad text
      var removeLen = text.length - startIdx - 1;
      //console.log('text  ' + text.length.toString());
      //console.log('start ' + startIdx.toString());
      //console.log('remov ' + removeLen.toString());
      //console.log('add   ' + new_res.length.toString());
      pad.spliceText(startIdx, removeLen, new_res);
      padMessageHandler.updatePadClients(pad);
      return 3;
    }); // fs.mkdtemp()
  }, // setTimeout() callback
  inputDelay_sec*1000);

  return true;
}
