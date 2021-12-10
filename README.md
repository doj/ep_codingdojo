# Etherpad Coding Dojo
![Screenshot](https://github.com/doj/ep_codingdojo/raw/main/static/image/ep_codingdojo.png)
## What is this?

An Etherpad Plugin to run a command on the server using the pad's text as an input (file).
Warning: This plugin does execute the (compiler) command unchecked, and without
any kind of protection. You can corrupt your system easily. Do not enable this
plugin on an Etherpad for users which can't be trusted. It is highly recommended
to protect the web server with features like a virtual machine, container, jail
when running this plugin.

## History
2021-12-08 start development
## License
Apache 2
## Author
Dirk Jagdmann <doj@cubic.org>
## Funding
If you want to support the development of this plugin, consider making a
payment to the author's PayPal account: https://paypal.me/dojcubic
## Links
https://github.com/doj/ep_codingdojo
https://github.com/ether/etherpad-lite
https://github.com/ether/etherpad-lite/wiki/Creating-a-plugin
https://nodejs.org/dist/latest-v17.x/docs/api/documentation.html

## Development Install

This etherpad plugin currently needs a patch of the upstream etherpad GIT repository.
It is also using some hard coded paths to a Node.js install on the /opt/ directory.

```sh
mkdir /opt/
cd /opt/
git clone https://github.com/doj/ep_codingdojo.git
git clone https://github.com/doj/etherpad-lite.git
cd etherpad-lite
git checkout pad-splicetext
cd ../ep_codingdojo
make run
```

## Docker container

The following instructions build a docker container:

```sh
git clone https://github.com/doj/etherpad-lite.git
cd etherpad-lite
git checkout pad-splicetext
wget https://github.com/doj/ep_codingdojo/raw/main/Dockerfile
# you may need to edit src/package-lock.json and change "lockfileVersion" to 2
docker build --build-arg DEFAULT_PAD_TEXT='int main() {\n printf("Hello World\\n");\n return 0;\n}\n=====c++ -Wall @a.cpp@ && ./a.out=====' --tag $USER/etherpad .
```

For more instructions how to build a docker container for Etherpad see
https://github.com/ether/etherpad-lite/blob/develop/doc/docker.md

To run the docker container:

```sh
docker run --publish 9001:9001 $USER/etherpad
```

And use the following URL http://localhost:9001

## Examples

### C++
```c++
#include <cstdio>
int main() {
    printf("Hello World\n");
    return 0;
}

=====c++ -Wall @a.cpp@ && ./a.out=====
```

### perl
```perl
use strict;
print "Hello World\n";

=====perl @a.pl@=====
Hello World
```

### python
```python
print "Hello World";

=====python @a.py@=====
```

### bourne shell
```sh
echo "Hello World"

=====bash @a.sh@=====
```

### Java

```java
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World");
  }
}

=====javac @Main.java@ && java Main=====
```

### Makefile

The default Etherpad configuration doesn't allow tab characters in pads.
Etherpad typically replaces tab characters with spaces.
Makefiles however require commands to start with a tab character.
This example compile command works around this by
replaceing 2 or more space characters at the start of the line with a single tab
character. This allows to edit a Makefile in Etherpad and have it compile.

```
all: Hello World

Hello:
    @echo -n 'Hello '

World:
    @echo 'World'
=====perl -i -pe 's/^\s{2,}/\t/' a.mak ; make -f @a.mak@=====
```

### Lua

```lua
print 'Hello World\n';

=====lua @a.lua@=====
```

## Compiler command line

The ep_codingdojo plugin will search in the pad's text for a line starting
with 5 or more equal characters and ending with 5 or more equal characters.
If the plugin finds such a line, it will attempt to parse it as a compile
command. If the parsing is successful, the compile command will be used to
compile the pad's text preceeding the compile line and the compile's output
will be appended to the pad after the compile line.

The compile line can have any (unix) command line, which is executed with the
system's native shell. The plugin will look for a special filename placeholder.
The filename must be enclosed in ampersand characters. The plugin will write
the source code (pad text above the compiler line) to the specified file name.
