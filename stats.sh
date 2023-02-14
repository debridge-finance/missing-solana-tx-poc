#!/bin/bash
HOUR=`date +"%H"`
FILE=`printf "%sutc.globalStats" $HOUR`
npm run stats >> /var/globalStats/$FILE