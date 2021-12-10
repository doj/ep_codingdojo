# Etherpad Coding Dojo
![Screenshot](https://user-images.githubusercontent.com/220864/107214131-5c3dd600-6a01-11eb-82d9-b2d67ec8ae93.png)
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
https://nodejs.dev/learn
https://nodejs.org/dist/latest-v17.x/docs/api/documentation.html

## Development Install

This etherpad plugin currently needs a patch of the upstream etherpad GIT repository.

- install this plugin source code, for example with: $ git clone https://github.com/doj/ep_codingdojo.git
- install the patched etherpad-lite source code: $ git clone https://github.com/doj/etherpad-lite.git
- $ cd etherpad-lite
- $ git checkout pad-splicetext
- $ npm install /path/to/ep_codingdojo
- $ src/bin/run.sh

## Examples

### C++
```c++
#include <cstdio>
int main() {
    printf("Hello World\n");
    return 0;
}

=====g++ -Wall @a.cpp@ && ./a.out=====
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
print "Hello World\n";

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

Currently Makefiles can't be writted in Etherpad, because the editor does
not like tab characters. When importing text, a tab character is typically
replaced with 4 space characters. When pressing the tab key, a special function
is used and the pad's text contains as asterisk character.

You would use a compiler command line like
```
=====make -f @a.mak@=====
```

### Lua

```lua
print 'Hello World\n';

=====lua @a.lua@=====
```
