#!/bin/bash
set -e
mysql --defaults-file=/dev/null -h localhost -u root -prootpassword -e "SELECT 1" > /dev/null 2>&1

