ETHERPAD_DIR ?= $(shell readlink -f ../etherpad-lite || echo "$(PWD)/../etherpad-lite")
PLUGIN_DIR := $(PWD)

all:	fastrun

clean:
	$(RM) *~

distclean:	clean
	$(RM) -r node_modules package-lock.json *.ts
	$(RM) -r $(ETHERPAD_DIR)/node_modules/*

setup.ts:
	@[ -d $(PLUGIN_DIR) ]   || ( echo "did not find $(PLUGIN_DIR)" ; false )
	@[ -d $(ETHERPAD_DIR) ] || ( echo "did not find $(ETHERPAD_DIR)" ; false )
	cd $(PLUGIN_DIR) && npm i
	ln -sf $(ETHERPAD_DIR)/src $(PLUGIN_DIR)/node_modules/ep_etherpad-lite
	ln -sf $(PLUGIN_DIR) $(ETHERPAD_DIR)/node_modules
	cd $(ETHERPAD_DIR)/src && npm i
	touch $@

run:	setup.ts
	$(ETHERPAD_DIR)/src/bin/run.sh

cleanrun cleanRun:	setup.ts
	$(ETHERPAD_DIR)/src/bin/cleanRun.sh

fastrun fastRun:	setup.ts
	$(ETHERPAD_DIR)/src/bin/fastRun.sh
