- make a video to show how this works, post on YouTube and link in README
- write multiple files
 + iterate pad text with lines
 + every line that has ^={5,}(.+)={5,}$ is a command line
 + save the previous block to an arbitrary file, marked with the @file.ext@ syntax
 + if the file marker is the only thing in the command line, do nothing else
 + otherwise execute all commands and show them at the end of the pad
