- make a video to show how this works, post on YouTube and link in README
- interpret vtXX or ANSI escapes and set Etherpad attributes for colors
- interleave output of commands:
=====write a.pl
use strict;
while(<>){
  s/abc/def/;
  print;
}
=====run perl a.pl
=====write b.pl
print 'hallo';
=====run perl b.pl

becomes:

=====write a.pl
use strict;
while(<>){
  s/abc/def/;
  print;
}
===->wrote XX bytes
=====run perl a.pl < a.pl
===->use strict;
===->while(<>){
===->  s/def/def/;
===->  print;
===->}
=====write b.pl
print 'hallo';
===->wrote XX bytes
=====run perl b.pl
===->hallo
