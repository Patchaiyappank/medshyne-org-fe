#!/bin/bash

# Navigate to the first React project and start it
cd Organization_SuperAdmin_Client
npm start &   # The & allows it to run in the background

# Navigate to the second React project and start it
cd Organization_Admin_Client
npm start &   # Again, & allows it to run in the background

echo "Both React apps have started successfully."