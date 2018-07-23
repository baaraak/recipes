#!/bin/bash
rm -rf ../buildServer
rm -rf ./build

echo 'REMOVED OLD BUILD FOLDERS!!!';

echo 'BUILD STARTED!!!';

npm run build

if [[ "$?" -ne 0 ]] ; then
  echo 'BUILD FAILED!!!'; exit $rc
fi

echo 'BUILD SCCESSED!!!';

cp -rf ./package.json ./build/
cp -rf ./app/models/categories.json ./build/models/categories.json
cp -rf ./build/ ../buildServer/
cp -rf ./static ../buildServer/uploads/

echo 'COPY FOLDER!!!';

cd ../buildServer

echo 'CONTECTED TO BUILD DIRECTORY!!!';

git init
git remote add origin https://github.com/baaraak/tarely-server.git
git checkout -b deployment
git fetch
git rebase deployment
git add .
git commit -am "push to deploy"
git push -u -f origin deployment

