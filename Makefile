ETHERPAD_DIR ?= $(PWD)/../etherpad-lite
ETHERPAD_ABSDIR := $(shell readlink -f "$(ETHERPAD_DIR)" 2> /dev/null || perl -MCwd -e 'print Cwd::abs_path shift' "$(ETHERPAD_DIR)")
PLUGIN_ABSDIR := $(PWD)

# when executing this Makefile for the first time do
# make run
# to setup the Etherpad.
# After a successful "make run" you can use the all: or fastRun: targets.
all:	fastRun

clean:
	$(RM) *~

distclean:	clean
	$(RM) -r node_modules package-lock.json *.ts
	$(RM) -r $(ETHERPAD_ABSDIR)/node_modules/*
	$(RM) $(ETHERPAD_ABSDIR)/package.json

setup.ts:
	@[ -d $(PLUGIN_ABSDIR) ]   || ( echo "did not find $(PLUGIN_ABSDIR)" ; false )
	@[ -d $(ETHERPAD_ABSDIR) ] || ( echo "did not find $(ETHERPAD_ABSDIR)" ; false )
	# npm install in the plugin directory is not required, as ep_codingdojo doesn't have any dependencies other than Etherpad.
	#cd $(PLUGIN_ABSDIR) && npm i
	mkdir $(PLUGIN_ABSDIR)/node_modules
	ln -sf $(ETHERPAD_ABSDIR)/src $(PLUGIN_ABSDIR)/node_modules/ep_etherpad-lite
	ln -sf $(PLUGIN_ABSDIR) $(ETHERPAD_ABSDIR)/node_modules
	cd $(ETHERPAD_ABSDIR)/src && npm i
	touch $@

run debugRun cleanRun:	setup.ts
	@touch run.ts
	@cd $(ETHERPAD_ABSDIR) && src/bin/$@.sh

fastRun:
	@[ -f run.ts ] || ( echo 'do "make run" first to setup Etherpad' ; false )
	@cd $(ETHERPAD_ABSDIR) && src/bin/$@.sh
