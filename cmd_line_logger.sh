#!/bin/bash

# why do we need this? The logger command will not log to a remote source.

while read "line"
do
  nc -w0 -u ${RAILS_SYSLOG_SERVER} ${RAILS_SYSLOG_PORT} <<< "<0>${ROLE_ID}: ${line}"
done
