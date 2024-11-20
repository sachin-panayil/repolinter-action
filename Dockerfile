FROM ghcr.io/newrelic-forks/repolinter:v0.9.2

# copy repolinter-action
WORKDIR /repolinter-action
COPY dist lib

# Working directory will automagically be set to github workspace when the container is executed
ENTRYPOINT ["bundle", "exec", "node /repolinter-action/lib/main.js"]
