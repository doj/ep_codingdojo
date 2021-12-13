# Etherpad Coding Dojo
![Screenshot](https://github.com/doj/ep_codingdojo/raw/main/static/image/ep_codingdojo.png)
## What is this?

An Etherpad Plugin to run a command on the server using the pad's text as an input (file).

Warning: This plugin does execute the (compiler) command unchecked, and without
any kind of protection. You can corrupt your system easily. Do not enable this
plugin on an Etherpad for users which can't be trusted. It is highly recommended
to protect the web server with features like a virtual machine, container, jail
when running this plugin. See the section 'Docker container' below how to build
a docker container with this software.

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
docker build --tag $USER/etherpad .
```

For more instructions how to build a docker container for Etherpad see
https://github.com/ether/etherpad-lite/blob/develop/doc/docker.md

To run the docker container:

```sh
docker run --publish 9001:9001 -e ADMIN_PASSWORD=admin -e PAD_OPTIONS_USE_MONOSPACE_FONT=true -e COMMIT_RATE_LIMIT_POINTS=20 $USER/etherpad
```

And use the following URL http://localhost:9001

To clean up the docker container and image:

```sh
docker container prune -f
docker image rm $USER/etherpad
docker image prune -f
```

## Examples

This section lists examples how to use many programming languages with the
plugin. These examples are all working with the docker image of the previous
section.

### Ada

```ada
with Text_IO; use Text_IO;
procedure hello is
begin
   Put_Line("Hello Ada");
end hello;

=====gnatmake @hello.adb@ && ./hello=====
```

### Algol 68

```algol
printf(($gl$, "Hello Algol"))

=====a68g @a.alg@=====
```

### Assembly x86-64

```asm
global _start
section .text
_start:
  mov rax, 1
  mov rdi, 1
  mov rsi, msg
  mov rdx, msglen
  syscall
  mov rax, 60
  mov rdi, 0
  syscall
section .rodata
  msg: db "Hello x86", 10
  msglen: equ $ - msg
=====nasm -f elf64 -o a.o @a.s@ && ld -o a.out a.o && ./a.out=====
```

### Bourne Again Shell

```sh
echo "Hello Bourne Again Shell"

=====bash @a.sh@=====
```

### C++

```c++
#include <cstdio>
int main() {
    printf("Hello C++\n");
    return 0;
}

=====c++ -Wall -std=c++20 @a.cpp@ && ./a.out=====
```

### C#

```C#
Console.WriteLine("Hello C#");

=====csharp @a.cs@=====
```

### C Shell

```csh
echo Hello C Shell

=====tcsh @c.sh@=====
```

### D

```d
import std.stdio;
void main()
{
  writeln("Hello D");
}

=====gdc @a.d@ && ./a.out=====
```

### Fortran

```fortran
program hello
  print *, 'Hello Fortran'
end program hello

=====gfortran @a.f90@ && ./a.out=====
```

### Go

```go
package main
import "fmt"
func main() {
  fmt.Println("Hello Go")
}

=====go run @a.go@=====
```

### Groovy

```groovy
println "Hello Groovy"

=====groovy @a.groovy@=====
```

### Lisp, Scheme, Guile

```lisp
(display "Hello Lisp")
(newline)

=====guile @a.scm@ 2>/dev/null=====
```

### Java

```java
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello Java");
  }
}

=====javac @Main.java@ && java Main=====
```

### JavaScript

```javascript
console.log('Hello JavaScript')

=====node @a.js@=====
```

### Lua

```lua
print 'Hello Lua\n';

=====lua @a.lua@=====
```

### Makefile

The default Etherpad configuration doesn't allow tab characters in pads.
Etherpad typically replaces tab characters with spaces.
Makefiles however require commands to start with a tab character.
This example compile command works around this by
replaceing 2 or more space characters at the start of the line with a single tab
character. This allows to edit a Makefile in Etherpad and have it compile.

Alternatively you can install the ep_special_characters plugin, which allows
to insert any unicode character into the pad. However the first 32 control
characters are shown with a blank square. To insert the tab character, select
the 9th square.

```
all: Hello World

Hello:
    @echo -n 'Hello '

World:
    @echo 'World'

=====perl -i -pe 's/^\s{2,}/\t/' a.mak ; make -f @a.mak@=====
```

### Matlab, GNU Octave

```matlab
disp('Hello Matlab')

=====octave @a.m@=====
```

### Objective C

```objc
#include <stdio.h>
int main(void)
{
   printf("Hello World\n");
}

=====gcc -lang objc @a.m@ && ./a.out=====
```

### OCaml

```ml
print_string "Hello OCaml\n"

=====ocaml @a.ml@=====
```

### Pascal

```pascal
program Hello;
begin
  writeln('Hello Pascal');
end.

=====fpc @a.pas@ && ./a=====
```

### Perl

```perl
use strict;
print "Hello Perl\n";

=====perl @a.pl@=====
Hello World
```

### PHP

```php
<html>
 <body>
 <?php echo '<p>Hello World</p>'; ?>
 </body>
</html>

=====php @a.php@=====
```

### Prolog

```prolog
:- initialization hello_world, halt.
hello_world :-
    write('Hello Prolog'), nl.

=====swipl -q -l @a.pl@=====
```

### Python
```python
print "Hello Python";

=====python @a.py@=====
```

### R

```r
print("Hello R")

=====Rscript @a.r@=====
```

### Ruby

```ruby
puts "Hello Ruby"

=====ruby @a.rb@=====
```

### Rust

```rust
fn main() {
  println!("Hello Rust");
}

=====rustc @a.rs@ && ./a=====
```

### SQL

```sql
create table t(a varchar(20));
insert into t(a) values('Hello'),('SQL');
select * from t;

=====sqlite3 a.db < @a.sql@=====
```

### TCL

```tcl
puts {Hello TCL}

=====tclsh @a.tcl@=====
````

### XSLT

```xml
<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
 <xsl:template match="p">Hello XSLT</xsl:template>
</xsl:stylesheet>
=====true @a.xslt@=====
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="a.xslt"?>
<p>this is replaced</p>
=====xsltproc a.xslt @a.xml@=====
```

### Z Shell

```zsh
print Hello Z Shell

=====zsh @z.sh@=====
```

### TODO

Maybe support for the following languages can be added to the docker image:
* Kotlin
* Erlang
* Falcon
* Smalltalk
* Basic https://github.com/mist64/cbmbasic
* Scala

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

### writing multiple files

Multiple compile lines can be present in the Etherpad text.
Every time a compile line is found, the text preceeding the line will be
written to a file and the command will be executed. Use a command which doesn't
do anything like "true" to only write a file. See the XSLT example above.

### show column numbers

If the compile command is 'showcols', a header with column numbers is added
to the output text.

```
=====showcols=====
```
