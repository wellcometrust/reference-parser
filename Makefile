.DEFAULT_GOAL := all

VIRTUALENV := build/virtualenv

IMAGE := uk.ac.wellcome/policytool
ECR_IMAGE := 160358319781.dkr.ecr.eu-west-1.amazonaws.com/$(IMAGE)
VERSION := latest


#
# policytool/web
#

WEB_BUILD_IMAGE := uk.ac.wellcome/policytool-web-build
WEB_BUILD_SOURCES := \
	policytool/web/static/style.css \
	policytool/web/gulpfile.js

WEB_BUILD_TARGETS := \
	build/web/static/style.css

# Image used for building web static assets
.PHONY: web-build-image
web-build-image:
	docker build \
		-t $(WEB_BUILD_IMAGE):latest \
		-f policytool/web/Dockerfile.node \
		policytool/web/


# NB: our target will run every time b/c web-build-image is
# a phony target. Not great but we don't need incremental builds
# for static web sources.
$(WEB_BUILD_TARGETS): web-build-image $(WEB_BUILD_SOURCES)
	@# CodePipeline (but not CodeBuild) code checkouts lose execution bits
	@# (https://forums.aws.amazon.com/thread.jspa?threadID=235452).
	@# So, fix this for CI builds.
	@chmod +x policytool/web/bin/docker_run.sh
	@mkdir -p build/web/static
	policytool/web/bin/docker_run.sh gulp default


#
# docker build for $(ECR_IMAGE):$(VERSION)
#

# Tags to use when run within codebuild.
#
# codebuild-${ISO8601}-${SHA_PREFIX}
CODEBUILD_VERSION := codebuild-$(shell date +%Y%m%dT%H%M%SZ)-$(shell \
	echo $$CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c1-7)
CODEBUILD_LATEST_TAG := codebuild-latest

.PHONY: base-image
base-image:
	docker build \
		-t policytool.base \
		-f Dockerfile.base \
		.

.PHONY: docker-build
docker-build: base-image $(WEB_BUILD_TARGETS)
	docker build \
		-t $(ECR_IMAGE):$(VERSION) \
		-t $(ECR_IMAGE):latest \
		-f Dockerfile \
		.

.PHONY: docker-push
docker-push: docker-test
	$$(aws ecr get-login --no-include-email --region eu-west-1) && \
	docker push $(ECR_IMAGE):$(VERSION) && \
	docker push $(ECR_IMAGE):latest

#
# build/virtualenv (for docker-less dev)
#

$(VIRTUALENV)/.installed: requirements.txt test_requirements.txt
	@if [ -d $(VIRTUALENV) ]; then rm -rf $(VIRTUALENV); fi
	@mkdir -p $(VIRTUALENV)
	virtualenv --python python3 $(VIRTUALENV)
	AIRFLOW_GPL_UNIDECODE=yes $(VIRTUALENV)/bin/pip3 install -r requirements.txt
	$(VIRTUALENV)/bin/pip3 install -r test_requirements.txt
	$(VIRTUALENV)/bin/python setup.py develop --no-deps
	touch $@

# Builds, tests, & pushes docker images with CodeBuild specific VERSION
# and LATEST_TAG.
.PHONY: codebuild-docker-push
codebuild-docker-push: VERSION := $(CODEBUILD_VERSION)
codebuild-docker-push: LATEST_TAG := $(CODEBUILD_LATEST_TAG)
codebuild-docker-push: docker-push

.PHONY: virtualenv
virtualenv: $(VIRTUALENV)/.installed

.PHONY: update-requirements-txt
update-requirements-txt: VIRTUALENV := /tmp/update-requirements-txt
update-requirements-txt:
	if [ -d $(VIRTUALENV) ]; then \
		rm -rf $(VIRTUALENV); \
	fi
	virtualenv --python python3 $(VIRTUALENV)
	$(VIRTUALENV)/bin/pip3 install -r unpinned_requirements.txt
	echo "# Created by 'make update-requirements-txt'. DO NOT EDIT!" > requirements.txt
	$(VIRTUALENV)/bin/pip freeze | grep -v pkg-resources==0.0.0 | \
		sed 's/airflow/airflow[celery]/' >> requirements.txt


#
# testing
#

.PHONY: test
test: virtualenv
	$(VIRTUALENV)/bin/pytest ./policytool

.PHONY: docker-test
docker-test: docker-build
	docker run -u root -v $$(pwd)/test_requirements.txt:/test_requirements.txt \
		--rm $(ECR_IMAGE):$(VERSION) \
		sh -c "pip3 install -r /test_requirements.txt && pytest /src/policytool"



.PHONY: all
all: docker-test
